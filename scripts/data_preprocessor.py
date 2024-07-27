from datetime import datetime
from textblob import TextBlob
import re

# Sample Reddit post data
reddit_post = {
    "title": "Wildfire near Edmonton! Evacuate immediately!",
    "description": "A massive wildfire has been reported near Edmonton. Residents are advised to evacuate immediately.",
    "created_at": "2024-06-27T18:45:00Z",
    "flairs": ["Breaking News"],
    "upvotes": 1000,
    "num_comments": 200,
    "user": {
        "created_at": "2015-01-01T12:00:00Z",
        "karma": 8000
    }
}

def normalize_text(text):
    # Convert to lowercase and remove non-alphanumeric characters
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text

def get_sentiment_score(text):
    blob = TextBlob(text)
    sentiment = blob.sentiment.polarity  # Returns a score between -1.0 and 1.0
    return sentiment

def extract_keywords(text):
    keywords = ["wildfire", "evacuation", "smoke", "fire"]
    return {keyword: 1 if keyword in text else 0 for keyword in keywords}

def calculate_account_age(created_at, current_date):
    created_at_date = datetime.strptime(created_at, "%Y-%m-%dT%H:%M:%SZ")
    current_date_date = datetime.strptime(current_date, "%Y-%m-%dT%H:%M:%SZ")
    return (current_date_date - created_at_date).days

def preprocess_reddit_post(post):
    normalized_text = normalize_text(post["title"] + " " + post["description"])
    sentiment_score = get_sentiment_score(normalized_text)
    keywords = extract_keywords(normalized_text)
    
    user_karma = post["user"]["karma"]
    account_age_days = calculate_account_age(post["user"]["created_at"], post["created_at"])
    
    upvotes = post["upvotes"]
    num_comments = post["num_comments"]
    engagement_ratio = (upvotes + num_comments) / user_karma
    
    return {
        "platform": "reddit",
        "text_normalized": normalized_text,
        "keywords": keywords,
        "sentiment": sentiment_score,
        "user_karma": user_karma,
        "account_age_days": account_age_days,
        "upvotes": upvotes,
        "num_comments": num_comments,
        "engagement_ratio": engagement_ratio
    }

# Example usage
reddit_features = preprocess_reddit_post(reddit_post)
print(reddit_features)