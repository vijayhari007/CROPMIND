from PIL import Image
import random
import numpy as np

class SoilClassifier:
    def __init__(self):
        """
        A simple soil classifier that analyzes image color and texture.
        This is a basic implementation that works without external dependencies.
        """
        self.soil_types = ['Sandy', 'Clay', 'Loamy', 'Silty']
        self.target_size = (224, 224)
    
    def preprocess_image(self, image):
        """Preprocess the input image"""
        if isinstance(image, str):
            image = Image.open(image)
        return image.convert('RGB').resize(self.target_size)
    
    def predict(self, image):
        """
        Predict soil type based on color analysis of the image.
        This is a simplified version that doesn't require ML models.
        """
        try:
            # Preprocess image
            img = self.preprocess_image(image)
            
            # Convert image to RGB array
            img_array = np.array(img)
            
            # Simple color analysis (this is a placeholder - real analysis would be more sophisticated)
            # Here we're just using the average color to make a guess
            avg_color = np.mean(img_array, axis=(0, 1))
            
            # Simple decision based on color (adjust these thresholds as needed)
            if avg_color[0] > 180 and avg_color[1] > 180 and avg_color[2] > 180:
                soil_type = 'Sandy'
            elif avg_color[0] < 100 and avg_color[1] < 100 and avg_color[2] < 100:
                soil_type = 'Clay'
            elif avg_color[1] > avg_color[0] and avg_color[1] > avg_color[2]:
                soil_type = 'Loamy'
            else:
                soil_type = 'Silty'
                
            # Generate mock confidence and probabilities (since we're not using a real model)
            confidence = 0.85
            all_probs = {st: 0.05 for st in self.soil_types}
            all_probs[soil_type] = confidence
            
            return {
                'soil_type': soil_type,
                'confidence': round(confidence, 4),
                'all_probs': all_probs
            }
            
        except Exception as e:
            print(f"Error in soil classification: {str(e)}")
            return {
                'soil_type': 'Unknown',
                'confidence': 0.0,
                'error': str(e)
            }
    
    def get_soil_properties(self, soil_type):
        """Get properties of the soil type (can be expanded based on your data)"""
        properties = {
            'Sandy': {
                'description': 'Gritty texture, drains quickly, low nutrient retention',
                'ph_range': '5.8-7.0',
                'drainage': 'Fast',
                'nutrient_retention': 'Low',
                'workability': 'Easy',
                'common_crops': ['Carrots', 'Potatoes', 'Lettuce', 'Strawberries']
            },
            'Clay': {
                'description': 'Sticky when wet, hard when dry, high nutrient retention',
                'ph_range': '5.5-7.5',
                'drainage': 'Slow',
                'nutrient_retention': 'High',
                'workability': 'Difficult',
                'common_crops': ['Cabbage', 'Broccoli', 'Brussels sprouts', 'Kale']
            },
            'Loamy': {
                'description': 'Well-balanced mixture of sand, silt, and clay',
                'ph_range': '6.0-7.0',
                'drainage': 'Moderate',
                'nutrient_retention': 'Good',
                'workability': 'Excellent',
                'common_crops': ['Tomatoes', 'Peppers', 'Corn', 'Beans', 'Most vegetables']
            },
            'Silty': {
                'description': 'Smooth texture, holds moisture well, fertile',
                'ph_range': '6.0-7.5',
                'drainage': 'Moderate to slow',
                'nutrient_retention': 'Good',
                'workability': 'Good',
                'common_crops': ['Wheat', 'Rice', 'Oats', 'Barley', 'Grasses']
            }
        }
        
        return properties.get(soil_type, {
            'description': 'Soil properties not available',
            'ph_range': 'N/A',
            'drainage': 'N/A',
            'nutrient_retention': 'N/A',
            'workability': 'N/A',
            'common_crops': []
        })
