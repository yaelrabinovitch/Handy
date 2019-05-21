import PIL, os
from PIL import Image
import cv2
import glob
import time

inputDirectory = r"C:\Users\YuvalMund\Documents\data\heb_raw"

start_char = "א"
for start_chat in range(1, 28):

    for filename in glob.glob(os.path.join(inputDirectory, start_char) + "/*.png") :

        #os.chdir(r"C:\Users\YuvalMund\Documents\data\heb_raw\אא") # change to directory where image is located

        picture= Image.open(filename)

        #picture.rotate(90).save(os.path.join(inputDirectory, start_char + "_" + "1_" + str(time.time()) + ".png"))

        picture1 = Image.new('RGBA', (80,80), (0,0,0,0))

        picture1.paste(picture)

        picture1.rotate(20).save(os.path.join(inputDirectory, start_char, start_char + "_" + "1_" + str(time.time()) + ".png"))

        #picture.rotate(-10).save(os.path.join(inputDirectory, start_char + "_" + "1_" + str(time.time()) + ".png"))

        picture2 = Image.new('RGBA', (80, 80), (0, 0, 0, 0))

        picture2.paste(picture)

        picture2.rotate(-20).save(os.path.join(inputDirectory, start_char, start_char + "_" + "1_" + str(time.time()) + ".png"))

        img = cv2.imread(r"C:\Users\YuvalMund\Documents\data\heb_raw\אא\א_1_1548533479.994.png")

        #im = picture.crop((3, 3, 70, 70))

        im1 = Image.new('RGBA', (80, 80), (0, 0, 0, 0))

        im1.paste(picture)

        im1.crop((3, 3, 70, 70)).save(os.path.join(inputDirectory, start_char,  start_char + "_" + "1_" + str(time.time()) + ".png"))

        im2 = Image.new('RGBA', (80, 80), (0, 0, 0, 0))

        im2.paste(picture)

        im2.crop((-20, -20, 100, 100)).save(os.path.join(inputDirectory, start_char, start_char + "_" + "1_" + str(time.time()) + ".png"))

    start_char = chr(ord(start_char) + 1)

# from PyPDF2 import PdfFileReader, PdfFileWriter
#
# import sys
#
# pdf1 = PdfFileReader(r"C:\Users\YuvalMund\Downloads\2_odd.pdf")
# pdf2 = PdfFileReader(r"C:\Users\YuvalMund\Downloads\2_even (1).pdf")
# pdf_writer = PdfFileWriter()
#
# for page in range(pdf1.getNumPages()):
#     pdf_writer.addPage(pdf1.getPage(page))
#     pdf_writer.addPage(pdf2.getPage(page))
#
#
# with open(r"C:\Users\YuvalMund\Desktop\להדפסה\asakim2.pdf", 'wb') as out:
#     pdf_writer.write(out)

