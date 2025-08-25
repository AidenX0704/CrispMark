import sys
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QLabel, QPushButton, 
                             QVBoxLayout, QHBoxLayout, QFileDialog, QSlider, QComboBox, 
                             QColorDialog, QSpinBox, QGroupBox, QFormLayout, QMessageBox)
from PyQt5.QtGui import QPixmap, QImage, QPainter, QFont, QColor, QPen
from PyQt5.QtCore import Qt
from PIL import Image, ImageDraw, ImageFont
import os


class WatermarkTool(QMainWindow):
    def __init__(self):
        super().__init__()
        
        # 初始化变量
        self.image_path = None
        self.original_pixmap = None
        self.watermarked_pixmap = None
        self.watermark_text = "Watermark"
        self.watermark_position = "bottom-right"
        self.watermark_opacity = 128
        self.watermark_color = QColor(255, 255, 255)
        self.font_size = 20
        self.font_family = "Arial"
        
        self.initUI()

    def initUI(self):
        self.setWindowTitle('图片水印工具')
        self.setGeometry(100, 100, 1000, 700)
        
        # 创建中央部件
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        # 创建主布局
        main_layout = QHBoxLayout(central_widget)
        
        # 左侧控制面板
        control_panel = QGroupBox("控制面板")
        control_layout = QVBoxLayout(control_panel)
        
        # 图片选择按钮
        self.select_image_btn = QPushButton("选择图片")
        self.select_image_btn.clicked.connect(self.select_image)
        control_layout.addWidget(self.select_image_btn)
        
        # 水印类型选择
        watermark_type_layout = QHBoxLayout()
        watermark_type_layout.addWidget(QLabel("水印类型:"))
        self.watermark_type_combo = QComboBox()
        self.watermark_type_combo.addItems(["文字水印", "图片水印"])
        watermark_type_layout.addWidget(self.watermark_type_combo)
        control_layout.addLayout(watermark_type_layout)
        
        # 文字水印设置
        text_settings_group = QGroupBox("文字水印设置")
        text_settings_layout = QFormLayout(text_settings_group)
        
        self.text_input = QPushButton("设置水印文字")
        self.text_input.clicked.connect(self.set_watermark_text)
        text_settings_layout.addRow("水印文字:", self.text_input)
        
        # 字体大小
        self.font_size_spin = QSpinBox()
        self.font_size_spin.setRange(10, 100)
        self.font_size_spin.setValue(20)
        self.font_size_spin.valueChanged.connect(self.update_font_size)
        text_settings_layout.addRow("字体大小:", self.font_size_spin)
        
        # 水印颜色
        color_layout = QHBoxLayout()
        self.color_button = QPushButton("选择颜色")
        self.color_button.clicked.connect(self.select_color)
        self.color_preview = QLabel()
        self.color_preview.setFixedSize(30, 30)
        color_layout.addWidget(self.color_button)
        color_layout.addWidget(self.color_preview)
        text_settings_layout.addRow("文字颜色:", color_layout)
        
        control_layout.addWidget(text_settings_group)
        
        # 位置设置
        position_group = QGroupBox("位置设置")
        position_layout = QVBoxLayout(position_group)
        
        self.position_combo = QComboBox()
        self.position_combo.addItems([
            "top-left", "top-center", "top-right",
            "center-left", "center", "center-right",
            "bottom-left", "bottom-center", "bottom-right"
        ])
        self.position_combo.setCurrentText("bottom-right")
        self.position_combo.currentTextChanged.connect(self.update_position)
        position_layout.addWidget(self.position_combo)
        
        control_layout.addWidget(position_group)
        
        # 透明度设置
        opacity_group = QGroupBox("透明度设置")
        opacity_layout = QVBoxLayout(opacity_group)
        
        self.opacity_slider = QSlider(Qt.Horizontal)
        self.opacity_slider.setRange(0, 255)
        self.opacity_slider.setValue(128)
        self.opacity_slider.valueChanged.connect(self.update_opacity)
        self.opacity_label = QLabel("透明度: 128")
        opacity_layout.addWidget(self.opacity_label)
        opacity_layout.addWidget(self.opacity_slider)
        
        control_layout.addWidget(opacity_group)
        
        # 操作按钮
        button_layout = QHBoxLayout()
        self.preview_btn = QPushButton("预览")
        self.preview_btn.clicked.connect(self.preview_watermark)
        self.save_btn = QPushButton("保存")
        self.save_btn.clicked.connect(self.save_image)
        button_layout.addWidget(self.preview_btn)
        button_layout.addWidget(self.save_btn)
        control_layout.addLayout(button_layout)
        
        # 添加弹簧以将控件推到顶部
        control_layout.addStretch()
        
        # 右侧图像显示区域
        image_area = QWidget()
        image_layout = QVBoxLayout(image_area)
        
        self.image_label = QLabel("请选择一张图片")
        self.image_label.setAlignment(Qt.AlignCenter)
        self.image_label.setMinimumSize(600, 500)
        self.image_label.setStyleSheet("border: 1px solid gray;")
        image_layout.addWidget(self.image_label)
        
        # 添加控件到主布局
        main_layout.addWidget(control_panel, 1)
        main_layout.addWidget(image_area, 4)
        
        # 初始化颜色预览
        self.update_color_preview()
        
    def select_image(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self, "选择图片", "", 
            "图片文件 (*.png *.jpg *.jpeg *.bmp *.gif)")
        
        if file_path:
            self.image_path = file_path
            self.load_image()
            
    def load_image(self):
        if self.image_path and os.path.exists(self.image_path):
            self.original_pixmap = QPixmap(self.image_path)
            self.display_image(self.original_pixmap)
            
    def display_image(self, pixmap):
        if pixmap:
            # 缩放图片以适应显示区域
            scaled_pixmap = pixmap.scaled(
                self.image_label.size(), 
                Qt.KeepAspectRatio, 
                Qt.SmoothTransformation
            )
            self.image_label.setPixmap(scaled_pixmap)
            
    def resizeEvent(self, event):
        # 窗口大小改变时重新显示图片
        super().resizeEvent(event)
        if self.original_pixmap:
            self.display_image(self.original_pixmap if not self.watermarked_pixmap else self.watermarked_pixmap)
            
    def set_watermark_text(self):
        from PyQt5.QtWidgets import QInputDialog
        text, ok = QInputDialog.getText(self, '设置水印文字', '请输入水印文字:', text=self.watermark_text)
        if ok and text:
            self.watermark_text = text
            
    def select_color(self):
        color = QColorDialog.getColor(self.watermark_color, self, "选择水印颜色")
        if color.isValid():
            self.watermark_color = color
            self.update_color_preview()
            
    def update_color_preview(self):
        pixmap = QPixmap(30, 30)
        pixmap.fill(self.watermark_color)
        self.color_preview.setPixmap(pixmap)
        
    def update_font_size(self, value):
        self.font_size = value
        
    def update_position(self, position):
        self.watermark_position = position
        
    def update_opacity(self, value):
        self.watermark_opacity = value
        self.opacity_label.setText(f"透明度: {value}")
        
    def preview_watermark(self):
        if not self.image_path:
            QMessageBox.warning(self, "警告", "请先选择一张图片")
            return
            
        if self.watermark_type_combo.currentText() == "文字水印":
            self.add_text_watermark()
        else:
            # 图片水印功能可以后续扩展
            QMessageBox.information(self, "提示", "图片水印功能尚未实现")
            
    def add_text_watermark(self):
        # 使用PIL处理图片
        image = Image.open(self.image_path).convert("RGBA")
        txt = Image.new('RGBA', image.size, (255, 255, 255, 0))
        
        # 创建字体
        try:
            font = ImageFont.truetype(self.font_family, self.font_size)
        except:
            font = ImageFont.load_default()
        
        # 创建绘图对象
        d = ImageDraw.Draw(txt)
        
        # 获取文字尺寸
        bbox = d.textbbox((0, 0), self.watermark_text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
        
        # 计算水印位置
        img_width, img_height = image.size
        margin = 10
        
        if self.watermark_position == "top-left":
            x, y = margin, margin
        elif self.watermark_position == "top-center":
            x, y = (img_width - text_width) // 2, margin
        elif self.watermark_position == "top-right":
            x, y = img_width - text_width - margin, margin
        elif self.watermark_position == "center-left":
            x, y = margin, (img_height - text_height) // 2
        elif self.watermark_position == "center":
            x, y = (img_width - text_width) // 2, (img_height - text_height) // 2
        elif self.watermark_position == "center-right":
            x, y = img_width - text_width - margin, (img_height - text_height) // 2
        elif self.watermark_position == "bottom-left":
            x, y = margin, img_height - text_height - margin
        elif self.watermark_position == "bottom-center":
            x, y = (img_width - text_width) // 2, img_height - text_height - margin
        elif self.watermark_position == "bottom-right":
            x, y = img_width - text_width - margin, img_height - text_height - margin
        else:
            x, y = img_width - text_width - margin, img_height - text_height - margin
        
        # 绘制文字水印
        color = (self.watermark_color.red(), self.watermark_color.green(), 
                self.watermark_color.blue(), self.watermark_opacity)
        d.text((x, y), self.watermark_text, font=font, fill=color)
        
        # 合并图像
        watermarked = Image.alpha_composite(image, txt)
        
        # 转换为QPixmap并显示
        self.watermarked_pixmap = self.pil_to_pixmap(watermarked)
        self.display_image(self.watermarked_pixmap)
        
    def pil_to_pixmap(self, pil_image):
        if pil_image.mode != "RGBA":
            pil_image = pil_image.convert("RGBA")
        
        data = pil_image.tobytes("raw", "RGBA")
        qimage = QImage(data, pil_image.width, pil_image.height, QImage.Format_RGBA8888)
        return QPixmap.fromImage(qimage)
        
    def save_image(self):
        if not self.watermarked_pixmap:
            QMessageBox.warning(self, "警告", "请先预览水印效果")
            return
            
        file_path, _ = QFileDialog.getSaveFileName(
            self, "保存图片", "", 
            "图片文件 (*.png *.jpg *.jpeg *.bmp)")
        
        if file_path:
            self.watermarked_pixmap.save(file_path)
            QMessageBox.information(self, "成功", "图片已保存")


def main():
    app = QApplication(sys.argv)
    window = WatermarkTool()
    window.show()
    sys.exit(app.exec_())


if __name__ == '__main__':
    main()