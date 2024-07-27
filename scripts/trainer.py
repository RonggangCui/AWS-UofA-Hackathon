import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import joblib

# Example data loading function
def load_data():
    # Replace with actual data loading
    data = pd.read_csv('social_media_data.csv')
    return data

# Example text normalization function
def normalize_text(text):
    return text.lower().replace('[^a-zA-Z0-9\s]', '')

# Example feature extraction function
def extract_features(data):
    data['text_normalized'] = data['text'].apply(normalize_text)
    vectorizer = TfidfVectorizer(max_features=1000)
    X_text = vectorizer.fit_transform(data['text_normalized']).toarray()
    
    # Combine with other features
    X = pd.concat([pd.DataFrame(X_text), data[['user_verified', 'user_followers_count', 'account_age_days', 'retweet_count', 'favorite_count', 'engagement_ratio']]], axis=1)
    y = data['label']
    
    return X, y, vectorizer

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