import streamlit as st
from PIL import Image
import tweepy
import io
import os

# Twitter API credentials (Replace with your own keys)
API_KEY = "EFgDzvYCOWVSpc7Qbuk4KfMtT"
API_SECRET = "YRJumvhplQ6Yq7mgr8QKR9xld2mY9dMuOBCfdslUvEYrur1Buh"
ACCESS_TOKEN = "1892878341889544192-6e99NGVYkXukVxcJ4Gnsg5qkhp1neR"
ACCESS_SECRET = "MafV3U4SSa3eGBtN10k4rnl3XWjQzIb12FswFNthxf1gc"

IMAGE_SIZES = [(300, 250), (728, 90), (160, 600), (300, 600)]

def authenticate_twitter():
    auth = tweepy.OAuth1UserHandler(API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_SECRET)
    return tweepy.API(auth, wait_on_rate_limit=True)


# Define required image sizes



def resize_image(image, size):
    return image.resize(size, Image.LANCZOS)

def upload_and_post_images(api, images):
    media_ids = []
    for img in images:
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)
        response = api.media_upload(filename="image.png", file=buf)
        media_ids.append(response.media_id_string)
    
    api.update_status(status="Here are your resized images!", media_ids=media_ids)

# Streamlit UI
st.title("Image Resizer & X Poster")
st.markdown("Upload an image, resize it to multiple dimensions, and post it to X (formerly Twitter)!")

uploaded_file = st.file_uploader("Upload an image", type=["png", "jpg", "jpeg"])

if uploaded_file:
    image = Image.open(uploaded_file)
    st.image(image, caption="Uploaded Image", use_column_width=True)
    
    resized_images = [resize_image(image, size) for size in IMAGE_SIZES]
    
    for img, size in zip(resized_images, IMAGE_SIZES):
        st.image(img, caption=f"Resized {size}", use_column_width=True)
    
    if st.button("Post to X"):
        api = authenticate_twitter()
        try:
            upload_and_post_images(api, resized_images)
            st.success("Images posted successfully!")
        except Exception as e:
            st.error(f"Error posting images: {e}")

st.markdown("### Features:")
st.markdown("- Upload an image in PNG, JPG, or JPEG format.")
st.markdown("- Automatically resize the image into 4 predefined sizes.")
st.markdown("- Post all resized images to your X (Twitter) account.")
st.markdown("- Secure authentication using Twitter API.")
st.markdown("- Handles errors like unsupported file formats and API failures gracefully.")
