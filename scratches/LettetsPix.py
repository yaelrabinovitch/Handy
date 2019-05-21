from PIL import Image
import numpy as np

im = Image.open(r'C:\Users\YuvalMund\Documents\data\paint.jpeg') # Can be many different formats.
pix = im.load()
im_cols = np.sum(im, axis=1) # (Width, )

black = 0
width, height = im.size
for i in range(0, im_cols.size): # Get the width and hight of the image for iterating over  # Get the RGBA Value of the a pixel of an image
    if (im_cols[i][1] < 5000 and im_cols[i][2] < 5000):
        print ("enter")
        for j in range(0, height - 10):
            pix[i + ((i - black) / 2) , j] = (255,255,255)
        black = i
        i += 10

    im.save(r'C:\Users\YuvalMund\Documents\data\word2.jpeg')  # Save the modified pixels as .png