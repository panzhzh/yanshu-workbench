#!/usr/bin/env python3
"""Render an SVG at source dimensions and report deterministic image differences."""

from __future__ import annotations

import argparse
import io
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path


def arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("svg", type=Path)
    parser.add_argument("--mode", choices=("pure", "hybrid"), default="pure")
    parser.add_argument("--comparison", type=Path)
    return parser.parse_args()


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def svg_structure(svg_path: Path, mode: str) -> dict[str, object]:
    root = ET.parse(svg_path).getroot()
    elements = list(root.iter())
    raster_elements = [item for item in elements if local_name(item.tag) == "image"]
    foreign_objects = [
        item for item in elements if local_name(item.tag) == "foreignObject"
    ]
    text_elements = [item for item in elements if local_name(item.tag) == "text"]
    text_without_calibri: list[str] = []

    def walk(item: ET.Element, inherited_family: str = "") -> None:
        style = item.attrib.get("style", "")
        style_family = re.search(r"font-family\s*:\s*([^;]+)", style, re.I)
        family = item.attrib.get("font-family", "")
        effective_family = family or (style_family.group(1) if style_family else "")
        effective_family = effective_family or inherited_family
        if local_name(item.tag) == "text" and "calibri" not in effective_family.lower():
            text_without_calibri.append(item.attrib.get("id", "<unidentified>"))
        for child in item:
            walk(child, effective_family)

    walk(root)

    raw_svg = svg_path.read_text(encoding="utf-8").lower()

    violations: list[str] = []
    if mode == "pure" and raster_elements:
        violations.append("pure-vector mode contains <image> elements")
    if mode == "pure" and "data:image/" in raw_svg:
        violations.append("pure-vector mode contains embedded raster data")
    if foreign_objects:
        violations.append("SVG contains <foreignObject> elements")
    if text_without_calibri:
        violations.append("visible text does not explicitly inherit or declare Calibri")

    return {
        "elements": len(elements),
        "textElements": len(text_elements),
        "rasterElements": len(raster_elements),
        "foreignObjects": len(foreign_objects),
        "textWithoutCalibri": text_without_calibri,
        "violations": violations,
    }


def main() -> int:
    args = arguments()
    try:
        from PIL import Image, ImageChops, ImageStat
        import cairosvg
    except ImportError as error:
        print(
            json.dumps(
                {
                    "ok": False,
                    "error": f"Missing validation dependency: {error.name}",
                    "required": ["Pillow", "CairoSVG"],
                }
            )
        )
        return 2

    source = Image.open(args.source).convert("RGBA")
    width, height = source.size
    rendered_bytes = cairosvg.svg2png(
        url=str(args.svg), output_width=width, output_height=height
    )
    rendered = Image.open(io.BytesIO(rendered_bytes)).convert("RGBA")
    difference = ImageChops.difference(source, rendered)
    statistics = ImageStat.Stat(difference)
    channel_mean = statistics.mean
    channel_rms = statistics.rms
    difference_bands = difference.split()
    changed = difference_bands[0]
    for band in difference_bands[1:]:
        changed = ImageChops.lighter(changed, band)
    histogram = changed.histogram()
    unchanged = histogram[0]
    total = width * height

    if args.comparison:
        args.comparison.parent.mkdir(parents=True, exist_ok=True)
        comparison = Image.new("RGBA", (width * 2, height), "white")
        comparison.paste(source, (0, 0))
        comparison.paste(rendered, (width, 0))
        comparison.save(args.comparison)

    structure = svg_structure(args.svg, args.mode)
    result = {
        "ok": not structure["violations"],
        "source": str(args.source.resolve()),
        "svg": str(args.svg.resolve()),
        "mode": args.mode,
        "dimensions": {"width": width, "height": height},
        "meanAbsoluteError": round(sum(channel_mean) / len(channel_mean), 6),
        "rootMeanSquareError": round(
            math.sqrt(sum(value * value for value in channel_rms) / len(channel_rms)),
            6,
        ),
        "changedPixelFraction": round((total - unchanged) / total, 8),
        "structure": structure,
        "comparison": str(args.comparison.resolve()) if args.comparison else None,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
