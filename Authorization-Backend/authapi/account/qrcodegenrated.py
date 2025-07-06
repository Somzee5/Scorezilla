import qrcode

# URL for which you want to generate the QR code
url = "https://www.example.com"

# Generate the QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_L,
    box_size=10,
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Create the image of the QR code
img = qr.make_image(fill="black", back_color="white")

# Save the image
img.save("qrcode.png")
