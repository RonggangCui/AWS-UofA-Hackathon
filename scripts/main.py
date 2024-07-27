import joblib
import pandas as pd
from data_preprocessor import extract_features_single

# Load the model and vectorizer
model = joblib.load('credibility_model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

# Sample input string
input_string = "Breaking: Wildfire near the outskirts of Edmonton! Evacuate immediately!"

# Preprocess and extract features for the sample input string
X_sample = extract_features_single(input_string, vectorizer)

# Make prediction
prediction = model.predict(X_sample)

# Interpret the prediction
if prediction[0] == 1:
    print("The information is verified.")
else:
    print("The information is not verified.")