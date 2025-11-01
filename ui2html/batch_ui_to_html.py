#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Enhanced .ui to HTML converter with LAYOUT AWARENESS.
Supports QVBoxLayout, QHBoxLayout, and basic QGridLayout.
"""

import sys
import xml.etree.ElementTree as ET
from pathlib import Path

# Basic widget mapping
WIDGET_MAP = {
    'QLabel': 'div',
    'QPushButton': 'button',
    'QLineEdit': 'input',
    'QTextEdit': 'textarea',
    'QPlainTextEdit': 'textarea',
    'QComboBox': 'select',
    'QCheckBox': 'input',
    'QRadioButton': 'input',
    'QGroupBox': 'fieldset',
    'QFrame': 'div',
}

def get_html_tag(widget_class):
    if widget_class == 'QCheckBox':
        return 'input', {'type': 'checkbox'}
    elif widget_class == 'QRadioButton':
        return 'input', {'type': 'radio'}
    elif widget_class == 'QLineEdit':
        return 'input', {'type': 'text'}
    elif widget_class in WIDGET_MAP:
        return WIDGET_MAP[widget_class], {}
    else:
        # Treat custom widgets (CardWidget, etc.) as div
        return 'div', {'class': f'qt-{widget_class.lower()}'}

def get_widget_property(widget_elem, prop_name, default=""):
    prop_elem = widget_elem.find(f'property[@name="{prop_name}"]')
    if prop_elem is not None:
        string_elem = prop_elem.find('string')
        if string_elem is not None and string_elem.text is not None:
            return string_elem.text
        bool_elem = prop_elem.find('bool')
        if bool_elem is not None and bool_elem.text is not None:
            return bool_elem.text.lower() == 'true'
        number_elem = prop_elem.find('number')
        if number_elem is not None and number_elem.text is not None:
            return number_elem.text
    return default

def process_layout(layout_elem):
    """Process a <layout> element and return its HTML container with children."""
    layout_class = layout_elem.get('class', '')
    layout_name = layout_elem.get('name', 'unnamed_layout')
    
    # Determine CSS display type
    if 'QVBoxLayout' in layout_class:
        container_style = "display: flex; flex-direction: column; gap: 8px;"
    elif 'QHBoxLayout' in layout_class:
        container_style = "display: flex; flex-direction: row; gap: 8px; align-items: center;"
    elif 'QGridLayout' in layout_class:
        # Basic grid: assume 2 columns for settings-like UI
        container_style = "display: grid; grid-template-columns: 1fr 1fr; gap: 12px;"
    else:
        container_style = "display: block;"
    
    # Process all items in the layout
    inner_content = ""
    for item in layout_elem.findall('item'):
        # Handle widget inside item
        child_widget = item.find('widget')
        if child_widget is not None:
            inner_content += process_widget_or_layout(child_widget)
        
        # Handle nested layout inside item (rare, but possible)
        nested_layout = item.find('layout')
        if nested_layout is not None:
            inner_content += process_layout(nested_layout)
    
    return f'<div class="qt-layout {layout_name}" style="{container_style}">{inner_content}</div>'

def process_widget_or_layout(elem):
    """Unified entry to process either a <widget> or handle its children/layouts."""
    if elem.tag != 'widget':
        return ""
    
    widget_class = elem.get('class')
    widget_name = elem.get('name', 'unnamed')
    text = get_widget_property(elem, 'text', '')
    title = get_widget_property(elem, 'title', '')
    
    html_tag, attrs = get_html_tag(widget_class)
    
    # Build attributes
    attr_str_parts = [f'id="{widget_name}"'] if widget_name else []
    for k, v in attrs.items():
        attr_str_parts.append(f'{k}="{v}"')
    
    # Special handling for layout containers (like QFrame used as container)
    layouts = elem.findall('layout')
    child_widgets = elem.findall('widget')
    
    inner_content = ""
    
    # Add own text if not a container
    if not layouts and html_tag not in ('input', 'fieldset') and text:
        inner_content += text
    
    # If this widget has layouts, render them instead of absolute children
    if layouts:
        for layout in layouts:
            inner_content += process_layout(layout)
    else:
        # Fallback: render direct child widgets (for non-layout cases)
        for child in child_widgets:
            inner_content += process_widget_or_layout(child)
    
    # Handle fieldset legend
    if html_tag == 'fieldset' and title:
        inner_content = f"<legend>{title}</legend>{inner_content}"
    
    # Build final tag
    attr_str = ' '.join(attr_str_parts)
    if html_tag in ('input',):
        if widget_class in ('QCheckBox', 'QRadioButton'):
            return f'<label {attr_str}>{text}</label>'
        else:
            return f'<{html_tag} {attr_str}>'
    else:
        return f'<{html_tag} {attr_str}>{inner_content}</{html_tag}>'

def convert_ui_file(ui_file_path):
    try:
        tree = ET.parse(ui_file_path)
        root = tree.getroot()
        main_widget = root.find('widget')
        if main_widget is None:
            print(f"  ⚠️  No main widget in {ui_file_path}")
            return False
        
        # Get main window size from geometry
        geom = main_widget.find('property[@name="geometry"]/rect')
        win_w, win_h = 800, 600
        if geom is not None:
            try:
                win_w = int(geom.find('width').text)
                win_h = int(geom.find('height').text)
            except:
                pass
        
        # Generate main content
        main_html = process_widget_or_layout(main_widget)
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UI from {ui_file_path.name}</title>
    <style>
        body {{
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
        }}
        .ui-container {{
            width: {win_w}px;
            background: white;
            border: 1px solid #ddd;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin: 0 auto;
            padding: 20px;
            box-sizing: border-box;
        }}
        /* Basic styling for Qt-like appearance */
        .qt-layout {{
            margin: 4px 0;
        }}
        button, input[type="text"], select, textarea {{
            padding: 6px 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 14px;
        }}
        button {{
            background: #f0f0f0;
            cursor: pointer;
        }}
        button:hover {{
            background: #e0e0e0;
        }}
        fieldset {{
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 10px;
            margin: 10px 0;
        }}
        legend {{
            font-weight: bold;
            padding: 0 5px;
        }}
        /* Style for custom widgets */
        .qt-cardwidget {{
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 12px;
            background: #fafafa;
            margin: 8px 0;
        }}
    </style>
</head>
<body>
    <div class="ui-container">
        {main_html}
    </div>
</body>
</html>"""
        
        html_file_path = ui_file_path.with_suffix('.html')
        with open(html_file_path, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"  ✅ Converted: {ui_file_path.name}")
        return True
        
    except Exception as e:
        print(f"  ❌ Error: {ui_file_path} - {e}")
        return False

def main():
    if len(sys.argv) != 2:
        print("Usage: python batch_ui_to_html_layout_aware.py <folder_path>")
        sys.exit(1)
    
    folder_path = Path(sys.argv[1])
    if not folder_path.exists() or not folder_path.is_dir():
        print(f"Error: '{folder_path}' is not a valid directory.")
        sys.exit(1)
    
    ui_files = list(folder_path.rglob("*.ui"))
    if not ui_files:
        print("No .ui files found.")
        return
    
    print(f"Converting {len(ui_files)} .ui file(s) with layout awareness...\n")
    success = sum(convert_ui_file(f) for f in ui_files)
    print(f"\n🎉 Done! {success}/{len(ui_files)} converted.")

if __name__ == "__main__":
    main()