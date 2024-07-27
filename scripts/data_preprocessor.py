# data_preprocessor.py

from datetime import datetime
from textblob import TextBlob
import re
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

def normalize_text(text):
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text

def get_sentiment_score(text):
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity
    return round(sentiment, 4)

def extract_keywords(text):
    keywords = ["wildfire", "evacuation", "smoke", "fire"]
    return {keyword: 1 if keyword in text else 0 for keyword in keywords}

def calculate_account_age(user_created_at, post_created_at):
    user_created_date = datetime.strptime(user_created_at, "%Y-%m-%dT%H:%M:%SZ")
    post_created_date = datetime.strptime(post_created_at, "%Y-%m-%dT%H:%M:%SZ")
    return (post_created_date - user_created_date).days

def preprocess_reddit_post(post):
    normalized_text = normalize_text(post["title"] + " " + post["description"])
    sentiment_score = get_sentiment_score(normalized_text)
    keywords = extract_keywords(normalized_text)
    
    user_karma = post["user"]["karma"]
    account_age_days = calculate_account_age(post["user"]["created_at"], post["created_at"])
    
    upvotes = post["upvotes"]
    number_of_downvotes = post["number_of_downvotes"]
    num_comments = post["num_comments"]
    num_shares = post["num_shares"]
    engagement_ratio = round((upvotes + num_comments + num_shares - number_of_downvotes) / user_karma, 4)
    
    return {
        "text_normalized": normalized_text,
        "sentiment": sentiment_score,
        "user_karma": user_karma,
        "account_age_days": account_age_days,
        "upvotes": upvotes,
        "number_of_downvotes": number_of_downvotes,
        "num_comments": num_comments,
        "num_shares": num_shares,
        "engagement_ratio": engagement_ratio,
        "keywords": keywords
    }

def preprocess_single_string(input_string):
    normalized_text = normalize_text(input_string)
    sentiment_score = get_sentiment_score(normalized_text)
    keywords = extract_keywords(normalized_text)
    
    return {
        "text_normalized": normalized_text,
        "sentiment": sentiment_score,
        "keywords": keywords
    }

def extract_features(data):
    features = data.apply(preprocess_reddit_post, axis=1)
    feature_df = pd.json_normalize(features)
    
    vectorizer = TfidfVectorizer(max_features=1000)
    X_text = vectorizer.fit_transform(feature_df['text_normalized']).toarray()
    
    X = pd.concat([pd.DataFrame(X_text), feature_df.drop(columns=['text_normalized', 'keywords'])], axis=1)
    
    # Add keyword columns separately
    for keyword in ["wildfire", "evacuation", "smoke", "fire"]:
        X[keyword] = feature_df['keywords'].apply(lambda x: x[keyword])
    
    y = data['label']
    
    return X, y, vectorizer

def extract_features_single(input_string, vectorizer):
    processed_data = preprocess_single_string(input_string)
    feature_df = pd.json_normalize(processed_data)
    
    X_text = vectorizer.transform(feature_df['text_normalized']).toarray()
    X = pd.DataFrame(X_text)
    
    X['sentiment'] = feature_df['sentiment']
    
    # Add keyword columns separately
    for keyword in ["wildfire", "evacuation", "smoke", "fire"]:
        X[keyword] = feature_df['keywords'].apply(lambda x: x[keyword])
    
    return X