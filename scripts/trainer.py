# model_trainer.py

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib
from data_preprocessor import extract_features

# Example data loading function
def load_data():
    # Load data from JSON file
    data = pd.read_json('reddit_posts.json')
    return data

# Load and preprocess data
data = load_data()
X, y, vectorizer = extract_features(data)

# Train-test split
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_val)
print(f'Accuracy: {accuracy_score(y_val, y_pred)}')
print(f'Precision: {precision_score(y_val, y_pred)}')
print(f'Recall: {recall_score(y_val, y_pred)}')
print(f'F1 Score: {f1_score(y_val, y_pred)}')

# Save the model and vectorizer
joblib.dump(model, 'credibility_model.pkl')
joblib.dump(vectorizer, 'vectorizer.pkl')