from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[2]
PROFILES_DIR = ROOT / "profiles"


@dataclass
class PreprocessConfig:
    deskew: bool = False
    clahe: bool = False
    denoise: str = "none"
    binarize: str = "none"
    shadow_removal: bool = False


def _parse_yaml_bool(value: str) -> bool | str | int:
    value = value.strip().strip('"').strip("'")
    if value.lower() == "true":
        return True
    if value.lower() == "false":
        return False
    if re.fullmatch(r"-?\d+", value):
        return int(value)
    return value


def load_preprocess_profile(name: str) -> PreprocessConfig:
    path = PROFILES_DIR / f"{name}.yaml"
    if not path.is_file():
        raise ValueError(f"Perfil de pré-processamento não encontrado: {name}")

    raw: dict[str, Any] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, val = line.split(":", 1)
        raw[key.strip()] = _parse_yaml_bool(val)

    return PreprocessConfig(
        deskew=bool(raw.get("deskew", False)),
        clahe=bool(raw.get("clahe", False)),
        denoise=str(raw.get("denoise", "none")),
        binarize=str(raw.get("binarize", "none")),
        shadow_removal=bool(raw.get("shadow_removal", False)),
    )


def pixmap_to_numpy(pixmap: Any):
    import numpy as np

    return np.frombuffer(pixmap.samples, dtype=np.uint8).reshape(
        pixmap.height, pixmap.width, pixmap.n
    )


def _to_bgr(img):
    import cv2

    if img.ndim == 2:
        return cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    if img.shape[2] == 4:
        return cv2.cvtColor(img, cv2.COLOR_RGBA2BGR)
    if img.shape[2] == 3:
        return cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    return img


def _to_rgb(img):
    import cv2

    if img.ndim == 2:
        return cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
    if img.shape[2] == 4:
        return cv2.cvtColor(img, cv2.COLOR_RGBA2RGB)
    return img


def _deskew(gray) -> float:
    import cv2
    import numpy as np

    coords = np.column_stack(np.where(gray > 0))
    if len(coords) < 100:
        return 0.0
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = 90 + angle
    elif angle > 45:
        angle = angle - 90
    if abs(angle) < 0.3 or abs(angle) > 15:
        return 0.0
    return angle


def preprocess_image(img, config: PreprocessConfig):
    import cv2
    import numpy as np

    if not any(
        (config.deskew, config.clahe, config.denoise != "none", config.binarize != "none", config.shadow_removal)
    ):
        return img

    bgr = _to_bgr(np.asarray(img))
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

    if config.shadow_removal:
        dilated = cv2.dilate(gray, np.ones((7, 7), np.uint8))
        bg = cv2.medianBlur(dilated, 21)
        diff = 255 - cv2.absdiff(gray, bg)
        gray = cv2.normalize(diff, None, 0, 255, cv2.NORM_MINMAX)

    if config.deskew:
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        angle = _deskew(binary)
        if angle:
            h, w = bgr.shape[:2]
            matrix = cv2.getRotationMatrix2D((w / 2, h / 2), angle, 1.0)
            bgr = cv2.warpAffine(
                bgr, matrix, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE
            )
            gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)

    if config.clahe:
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        gray = clahe.apply(gray)

    if config.denoise == "median":
        gray = cv2.medianBlur(gray, 3)
    elif config.denoise == "bilateral":
        gray = cv2.bilateralFilter(gray, 9, 75, 75)

    if config.binarize == "otsu":
        _, gray = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    elif config.binarize == "adaptive":
        gray = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 11
        )

    if config.binarize != "none":
        return cv2.cvtColor(gray, cv2.COLOR_GRAY2RGB)
    return _to_rgb(bgr)


def save_debug_pair(
    debug_dir: Path,
    page_number: int,
    raw_img,
    processed_img,
    *,
    suffix: str = "",
) -> None:
    import cv2

    debug_dir.mkdir(parents=True, exist_ok=True)
    tag = f"page{page_number:03d}{suffix}"
    cv2.imwrite(str(debug_dir / f"{tag}_raw.png"), _to_bgr(raw_img))
    cv2.imwrite(str(debug_dir / f"{tag}_processed.png"), _to_bgr(processed_img))
