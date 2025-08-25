from PIL import Image, ExifTags
import os
from typing import Dict, Any, Optional, Union
from datetime import datetime


class EXIFReader:
    """
    图片EXIF信息读取工具类
    """

    @staticmethod
    def read_exif(image_path: str) -> Dict[str, Any]:
        """
        读取图片的EXIF信息

        Args:
            image_path (str): 图片文件路径

        Returns:
            Dict[str, Any]: EXIF信息字典，键为标签名，值为对应的值

        Raises:
            FileNotFoundError: 当图片文件不存在时
            OSError: 当图片文件无法打开时
            Exception: 其他异常
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"图片文件不存在: {image_path}")

        try:
            # 打开图片
            image = Image.open(image_path)

            # 获取EXIF数据
            exif_data = image.getexif()

            if not exif_data:
                return {}

            # 将EXIF标签ID转换为可读的标签名
            exif_dict = {}
            for tag_id, value in exif_data.items():
                tag_name = ExifTags.TAGS.get(tag_id, f"Unknown_{tag_id}")
                exif_dict[tag_name] = value

            return exif_dict

        except Exception as e:
            raise Exception(f"读取EXIF信息失败: {str(e)}")

    @staticmethod
    def get_specific_exif_tag(image_path: str, tag_name: str) -> Optional[Any]:
        """
        获取特定的EXIF标签值

        Args:
            image_path (str): 图片文件路径
            tag_name (str): EXIF标签名

        Returns:
            Optional[Any]: 标签值，如果不存在则返回None
        """
        exif_data = EXIFReader.read_exif(image_path)
        return exif_data.get(tag_name)

    @staticmethod
    def get_basic_info(image_path: str) -> Dict[str, Any]:
        """
        获取图片基本信息（尺寸、格式等）

        Args:
            image_path (str): 图片文件路径

        Returns:
            Dict[str, Any]: 基本信息字典
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"图片文件不存在: {image_path}")

        try:
            image = Image.open(image_path)
            return {
                "format": image.format,
                "size": image.size,
                "mode": image.mode
            }
        except Exception as e:
            raise Exception(f"读取图片基本信息失败: {str(e)}")

    @staticmethod
    def get_gps_info(image_path: str) -> Dict[str, Any]:
        """
        获取GPS信息

        Args:
            image_path (str): 图片文件路径

        Returns:
            Dict[str, Any]: GPS信息字典
        """
        exif_data = EXIFReader.read_exif(image_path)
        gps_info = exif_data.get("GPSInfo")

        if not gps_info:
            return {}

        # 解析GPS信息
        gps_dict = {}
        for key in gps_info.keys():
            gps_tag_name = ExifTags.GPSTAGS.get(key, f"Unknown_{key}")
            gps_dict[gps_tag_name] = gps_info[key]

        return gps_dict

    @staticmethod
    def get_datetime_info(image_path: str) -> Dict[str, Optional[datetime]]:
        """
        获取时间相关信息

        Args:
            image_path (str): 图片文件路径

        Returns:
            Dict[str, Optional[datetime]]: 时间信息字典
        """
        exif_data = EXIFReader.read_exif(image_path)

        datetime_info = {
            "DateTime": None,
            "DateTimeOriginal": None,
            "DateTimeDigitized": None
        }

        # 解析各个时间字段
        for key in datetime_info.keys():
            datetime_str = exif_data.get(key)
            if datetime_str:
                try:
                    # 尝试解析时间字符串
                    dt = datetime.strptime(datetime_str, "%Y:%m:%d %H:%M:%S")
                    datetime_info[key] = dt
                except ValueError:
                    # 如果解析失败，保留原始字符串
                    datetime_info[key] = datetime_str

        return datetime_info

    @staticmethod
    def print_exif(image_path: str) -> None:
        """
        打印图片的所有EXIF信息

        Args:
            image_path (str): 图片文件路径
        """
        try:
            exif_data = EXIFReader.read_exif(image_path)

            if not exif_data:
                print("该图片没有EXIF信息")
                return

            print(f"图片: {image_path}")
            print("=" * 50)

            for tag, value in exif_data.items():
                print(f"{tag}: {value}")

        except Exception as e:
            print(f"读取EXIF信息时出错: {e}")


if __name__ == "__main__":
    # 示例用法
    reader = EXIFReader()
    exif_data = reader.read_exif("../images/IMG_8121.jpg")
    print(exif_data)
