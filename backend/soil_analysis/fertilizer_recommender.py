class FertilizerRecommender:
    def __init__(self):
        """
        Initialize the fertilizer recommender with knowledge about soil types and crop requirements.
        """
        # Base recommendations (can be expanded based on agricultural data)
        self.recommendations = {
            'Sandy': {
                'primary': 'Balanced NPK (10-10-10)',
                'secondary': 'Organic matter (compost, manure)',
                'micronutrients': 'Magnesium and Boron',
                'application': 'Frequent light applications (sandy soil leaches nutrients)'
            },
            'Clay': {
                'primary': 'Phosphorus-rich (5-10-5)',
                'secondary': 'Organic matter to improve structure',
                'micronutrients': 'Zinc and Iron',
                'application': 'Heavy applications less frequently (clay holds nutrients well)'
            },
            'Loamy': {
                'primary': 'Balanced NPK (10-10-10)',
                'secondary': 'Compost for maintenance',
                'micronutrients': 'Generally well-balanced',
                'application': 'Standard application rates'
            },
            'Silty': {
                'primary': 'Nitrogen-rich (20-10-10)',
                'secondary': 'Organic matter',
                'micronutrients': 'Sulfur and Manganese',
                'application': 'Moderate applications'
            }
        }
        
        # Crop-specific adjustments
        self.crop_adjustments = {
            'Tomato': {
                'primary': 'Phosphorus-rich (5-10-5)',
                'special_notes': 'Add calcium to prevent blossom end rot'
            },
            'Wheat': {
                'primary': 'Nitrogen-rich (20-10-10)',
                'special_notes': 'Split application: half at planting, half at tillering'
            },
            'Rice': {
                'primary': 'Balanced NPK (10-10-10)',
                'special_notes': 'Zinc sulfate application may be needed'
            },
            'Corn': {
                'primary': 'Nitrogen-rich (30-10-10)',
                'special_notes': 'Side-dress with nitrogen when plants are knee-high'
            }
            # Add more crops as needed
        }
    
    def get_recommendation(self, soil_type, crop=None):
        """
        Get fertilizer recommendations based on soil type and optional crop.
        
        Args:
            soil_type (str): The type of soil (e.g., 'Sandy', 'Clay')
            crop (str, optional): The crop to be grown
            
        Returns:
            dict: Fertilizer recommendations
        """
        # Get base recommendation for soil type
        base_rec = self.recommendations.get(soil_type, {
            'primary': 'Balanced NPK (10-10-10)',
            'secondary': 'Organic matter',
            'micornutrients': 'General purpose',
            'application': 'Standard application rates'
        })
        
        # Initialize result with base recommendation
        result = {
            'soil_type': soil_type,
            'general_recommendation': base_rec,
            'crop_specific': None,
            'special_notes': []
        }
        
        # Add crop-specific adjustments if crop is provided
        if crop:
            crop = crop.capitalize()
            crop_rec = self.crop_adjustments.get(crop, {})
            
            if crop_rec:
                result['crop_specific'] = {
                    'crop': crop,
                    'primary': crop_rec.get('primary', base_rec['primary']),
                    'special_notes': crop_rec.get('special_notes', '')
                }
                
                # Add special notes
                if crop == 'Tomato' and soil_type == 'Sandy':
                    result['special_notes'].append('Sandy soil may require more frequent watering for tomatoes.')
                elif crop == 'Rice' and soil_type != 'Silty':
                    result['special_notes'].append(f'Consider adding organic matter to improve water retention for rice in {soil_type.lower()} soil.')
        
        return result
    
    def get_fertilizer_schedule(self, soil_type, crop=None):
        """
        Get a general fertilizer application schedule based on soil type and crop.
        
        Args:
            soil_type (str): The type of soil
            crop (str, optional): The crop to be grown
            
        Returns:
            dict: Fertilizer application schedule
        """
        # Base schedule (can be expanded based on specific requirements)
        schedule = {
            'pre_planting': {
                'timing': '2-4 weeks before planting',
                'recommendation': 'Incorporate organic matter and base fertilizer into the soil'
            },
            'planting': {
                'timing': 'At planting',
                'recommendation': 'Apply starter fertilizer near the seed/plant'
            },
            'growing_season': {
                'timing': 'During active growth',
                'recommendation': 'Side-dress with nitrogen-rich fertilizer'
            },
            'post_harvest': {
                'timing': 'After harvest',
                'recommendation': 'Add compost or organic matter to replenish soil nutrients'
            }
        }
        
        # Adjust based on soil type
        if soil_type == 'Sandy':
            schedule['growing_season']['recommendation'] = 'Frequent light applications of fertilizer (every 3-4 weeks)'
        elif soil_type == 'Clay':
            schedule['growing_season']['recommendation'] = 'Heavier applications less frequently (every 6-8 weeks)'
        
        # Adjust based on crop (simplified example)
        if crop and crop.lower() == 'tomato':
            schedule['growing_season']['recommendation'] += '. Add calcium to prevent blossom end rot.'
        
        return schedule
