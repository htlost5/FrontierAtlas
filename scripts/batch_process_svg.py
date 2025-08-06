import os
import xml.etree.ElementTree as ET

def rect_to_path(el):
    """
    <rect x y width height>を<path d="M...Z">に変換する
    """
    x = float(el.get('x', '0'))
    y = float(el.get('y', '0'))
    w = float(el.get('width', '0'))
    h = float(el.get('height', '0'))

    d = f"M{x},{y} h{w} v{h} h{-w} Z"

    path_el = ET.Element(f"{{http://www.w3.org/2000/svg}}path")
    path_el.set("d", d)

    # idをrectから引き継ぐ
    if 'id' in el.attrib:
        path_el.set('id', el.attrib['id'])

    return path_el

def process_svg(input_path):
    SVG_NS = "http://www.w3.org/2000/svg"
    ET.register_namespace('', SVG_NS)

    tree = ET.parse(input_path)
    root = tree.getroot()

    file_id = os.path.splitext(os.path.basename(input_path))[0]
    root.set("id", file_id)

    def clean_element(el):
        children = list(el)
        for child in children:
            if child.tag == f"{{{SVG_NS}}}rect":
                path_el = rect_to_path(child)
                el.remove(child)
                el.append(path_el)
                clean_element(path_el)
            else:
                clean_element(child)

        for attr in ["fill", "stroke", "stroke-width"]:
            if attr in el.attrib:
                del el.attrib[attr]

    clean_element(root)
    tree.write(input_path, encoding='utf-8', xml_declaration=True)  # 上書き保存

def process_folder(input_dir):
    for filename in os.listdir(input_dir):
        if filename.lower().endswith(".svg"):
            file_path = os.path.join(input_dir, filename)
            process_svg(file_path)
            print(f"上書き加工済み: {filename}")

if __name__ == "__main__":
    input_folder = "./assets/images/map/5F"
    process_folder(input_folder)
    print("フォルダ内SVGをすべて上書き加工完了！")
