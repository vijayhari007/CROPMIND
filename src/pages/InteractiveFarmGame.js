import React, { useState, useRef, useEffect } from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ParkIcon from '@mui/icons-material/Park';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

const CROPS = [
  { 
    id: 1, 
    name: 'Wheat', 
    growthTime: 5, 
    waterNeeded: 3, 
    emoji: '🌾', 
    color: '#8bc34a',
    phMin: 6.0,
    phMax: 7.5,
    npk: {n: 'Medium', p: 'High', k: 'Medium'},
    description: 'Wheat grows best in well-drained soil with neutral to slightly alkaline pH. It requires good nitrogen levels for growth and phosphorus for root development.'
  },
  { 
    id: 2, 
    name: 'Carrot', 
    growthTime: 4, 
    waterNeeded: 2, 
    emoji: '🥕', 
    color: '#ff9800',
    phMin: 5.5,
    phMax: 7.0,
    npk: {n: 'Medium', p: 'Medium', k: 'High'},
    description: 'Carrots prefer slightly acidic to neutral soil. They need good potassium levels for root development and consistent moisture.'
  },
  { 
    id: 3, 
    name: 'Tomato', 
    growthTime: 6, 
    waterNeeded: 4, 
    emoji: '🍅', 
    color: '#f44336',
    phMin: 6.0,
    phMax: 6.8,
    npk: {n: 'Medium', p: 'High', k: 'High'},
    description: 'Tomatoes thrive in slightly acidic soil with good drainage. They require high phosphorus for fruit development and potassium for overall plant health.'
  },
  { 
    id: 4, 
    name: 'Rice', 
    growthTime: 5, 
    waterNeeded: 5, 
    emoji: '🌾', 
    color: '#4caf50',
    phMin: 5.0,
    phMax: 6.5,
    npk: {n: 'High', p: 'Medium', k: 'Medium'},
    description: 'Rice grows well in slightly acidic to neutral soil. It requires high nitrogen levels for vegetative growth and benefits from phosphorus for root development.'
  },
];

const Farmer = styled(motion.div)({
  width: 60,
  height: 80,
  backgroundImage: 'url(https://cdn-icons-png.flaticon.com/512/1809/1809558.png)',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  position: 'absolute',
  cursor: 'grab',
  zIndex: 10,
  '&:active': {
    cursor: 'grabbing',
  },
});

const FarmPlot = styled(motion.div)({
  width: 100,
  height: 100,
  borderRadius: 8,
  backgroundColor: '#8d6e63',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
});

const Crop = styled(motion.div)({
  position: 'absolute',
  bottom: 10,
  fontSize: '2rem',
  zIndex: 2,
});

const WaterIndicator = styled(motion.div)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 4,
  backgroundColor: '#2196f3',
});

const GameContainer = styled(Paper)({
  padding: '20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '12px',
  position: 'relative',
  minHeight: '500px',
  overflow: 'hidden',
});

const FarmGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '20px',
  marginTop: '30px',
});

const Inventory = styled('div')({
  display: 'flex',
  gap: '10px',
  marginTop: '20px',
  flexWrap: 'wrap',
});

const InventoryItem = styled(motion.div)({
  padding: '10px 15px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  border: '2px solid transparent',
  '&.selected': {
    borderColor: '#4caf50',
    boxShadow: '0 0 0 2px #4caf50',
  },
});

const GameMessage = styled(motion.div)({
  position: 'absolute',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '10px 20px',
  borderRadius: '20px',
  zIndex: 100,
});

const InteractiveFarmGame = () => {
  // Soil testing state
  const [soilData, setSoilData] = useState({
    ph: 0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    tested: false
  });
  
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [farmerPosition, setFarmerPosition] = useState({ x: 50, y: 50 });
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [message, setMessage] = useState('Drag the farmer to plant and water crops!');
  const [gameState, setGameState] = useState('selecting'); // 'selecting', 'planting', 'watering', 'growing'
  const [plots, setPlots] = useState(Array(9).fill(null).map((_, i) => ({
    id: i,
    crop: null,
    growth: 0,
    waterLevel: 0,
    isWatered: false,
  })));
  const [showMessage, setShowMessage] = useState(true);
  const [day, setDay] = useState(1);
  const [inventory, setInventory] = useState([
    { type: 'seed', crop: CROPS[0], count: 5 },
    { type: 'seed', crop: CROPS[1], count: 3 },
    { type: 'seed', crop: CROPS[2], count: 3 },
    { type: 'water', count: 10 },
  ]);

  const gameAreaRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleFarmerDragStart = (e) => {
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleFarmerDrag = (e) => {
    if (!isDragging.current) return;
    
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - gameArea.left - 30, gameArea.width - 60));
    const y = Math.max(0, Math.min(e.clientY - gameArea.top - 40, gameArea.height - 80));
    
    setFarmerPosition({ x, y });
  };

  const handleFarmerDragEnd = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    // Check if dropped on a plot
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const plotElement = elements.find(el => el.classList.contains('farm-plot'));
    
    if (plotElement) {
      const plotId = parseInt(plotElement.dataset.id);
      const plot = plots[plotId];
      
      if (gameState === 'planting' && selectedCrop && !plot.crop) {
        // Plant the crop
        const newPlots = [...plots];
        newPlots[plotId] = {
          ...plot,
          crop: selectedCrop,
          growth: 0,
          waterLevel: 0,
        };
        
        // Update inventory
        const newInventory = [...inventory];
        const seedIndex = newInventory.findIndex(item => 
          item.type === 'seed' && item.crop.id === selectedCrop.id
        );
        
        if (seedIndex !== -1) {
          newInventory[seedIndex].count -= 1;
          if (newInventory[seedIndex].count <= 0) {
            newInventory.splice(seedIndex, 1);
          }
          setInventory(newInventory);
        }
        
        setPlots(newPlots);
        setMessage(`Planted ${selectedCrop.name}! Now water it.`);
        setGameState('watering');
        setShowMessage(true);
      } 
      else if (gameState === 'watering' && plot.crop && !plot.isWatered) {
        // Water the crop
        const newPlots = [...plots];
        newPlots[plotId] = {
          ...plot,
          waterLevel: plot.waterLevel + 1,
          isWatered: true,
        };
        
        // Update water inventory
        const newInventory = [...inventory];
        const waterIndex = newInventory.findIndex(item => item.type === 'water');
        if (waterIndex !== -1) {
          newInventory[waterIndex].count -= 1;
          if (newInventory[waterIndex].count <= 0) {
            newInventory.splice(waterIndex, 1);
          }
          setInventory(newInventory);
        }
        
        setPlots(newPlots);
        setMessage('Great! The crop is watered. Wait for it to grow.');
        setShowMessage(true);
        
        // Check if all planted crops are watered
        const allWatered = newPlots.every(p => !p.crop || p.isWatered);
        if (allWatered) {
          setGameState('growing');
          setMessage('All crops are watered! Click "Next Day" to see them grow.');
          setShowMessage(true);
        }
      }
    }
  };

  const handleSelectCrop = (crop) => {
    setSelectedCrop(crop);
    setGameState('planting');
    setMessage(`Selected ${crop.name}. Now drag the farmer to a plot to plant.`);
    setShowMessage(true);
  };

  const handleNextDay = () => {
    // Update growth for watered plants
    const newPlots = plots.map(plot => {
      if (!plot.crop) return plot;
      
      const newGrowth = plot.isWatered 
        ? Math.min(plot.growth + 1, plot.crop.growthTime)
        : plot.growth;
      
      return {
        ...plot,
        growth: newGrowth,
        isWatered: false,
      };
    });

    // Check for harvestable crops
    let harvested = false;
    newPlots.forEach((plot, index) => {
      if (plot.crop && plot.growth >= plot.crop.growthTime) {
        // Harvest the crop
        newPlots[index] = { ...plot, crop: null, growth: 0, waterLevel: 0 };
        harvested = true;
      }
    });

    setPlots(newPlots);
    setDay(day + 1);
    
    // Refill water can
    const waterIndex = inventory.findIndex(item => item.type === 'water');
    const newInventory = [...inventory];
    if (waterIndex === -1) {
      newInventory.push({ type: 'water', count: 10 });
    } else {
      newInventory[waterIndex].count += 10;
    }
    setInventory(newInventory);

    if (harvested) {
      setMessage('Crops harvested! Plant more to continue.');
    } else {
      setMessage('A new day begins! Water your plants again.');
    }
    
    setGameState('selecting');
    setShowMessage(true);
  };

  const testSoil = () => {
    // Simulate soil testing
    const newSoilData = {
      ph: Math.random() * 14,
      nitrogen: Math.random() * 100,
      phosphorus: Math.random() * 100,
      potassium: Math.random() * 100,
      tested: true,
    };
    setSoilData(newSoilData);

    // Get recommended crops based on soil data
    const recommendedCrops = CROPS.filter(crop => {
      const phInRange = crop.phMin <= newSoilData.ph && newSoilData.ph <= crop.phMax;
      const npkMatch = crop.npk.n <= newSoilData.nitrogen && crop.npk.p <= newSoilData.phosphorus && crop.npk.k <= newSoilData.potassium;
      return phInRange && npkMatch;
    });
    setRecommendedCrops(recommendedCrops);
  };

  const getPHColor = (ph) => {
    if (ph < 5.5) return 'red';
    if (ph > 7.5) return 'blue';
    return 'green';
  };

  const getNutrientLevel = (level) => {
    if (level < 20) return 'Low';
    if (level < 50) return 'Medium';
    return 'High';
  };

  const getCropSize = (growth, maxGrowth) => {
    return 0.5 + (growth / maxGrowth) * 0.5;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Soil Testing Section */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2" gutterBottom>
            🌱 Soil Testing & Crop Recommendations
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={testSoil}
            startIcon={<EmojiEventsIcon />}
          >
            Test Soil
          </Button>
        </Box>
        
        {soilData.tested && (
          <Box>
            <Typography variant="h6" gutterBottom>Soil Analysis Results:</Typography>
            <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={2} mb={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">pH Level</Typography>
                <Typography variant="h6" sx={{ color: getPHColor(soilData.ph) }}>
                  {soilData.ph} {soilData.ph < 5.5 ? '(Acidic)' : soilData.ph > 7.5 ? '(Alkaline)' : '(Neutral)'}
                </Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">Nitrogen (N)</Typography>
                <Typography variant="h6">{getNutrientLevel(soilData.nitrogen)}</Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">Phosphorus (P)</Typography>
                <Typography variant="h6">{getNutrientLevel(soilData.phosphorus)}</Typography>
              </Paper>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">Potassium (K)</Typography>
                <Typography variant="h6">{getNutrientLevel(soilData.potassium)}</Typography>
              </Paper>
            </Box>
            
            {recommendedCrops.length > 0 ? (
              <Box>
                <Typography variant="h6" gutterBottom>Recommended Crops:</Typography>
                <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={2}>
                  {recommendedCrops.slice(0, 3).map((crop, index) => (
                    <Paper key={crop.id} sx={{ p: 2, borderLeft: `4px solid ${crop.color}`, position: 'relative' }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="h6" sx={{ mr: 1 }}>{crop.emoji}</Typography>
                        <Typography variant="subtitle1" fontWeight="bold">{crop.name}</Typography>
                        <Box sx={{ 
                          ml: 'auto', 
                          bgcolor: index === 0 ? '#4caf50' : index === 1 ? '#8bc34a' : '#cddc39',
                          color: 'white',
                          px: 1,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          {index === 0 ? 'Best Match' : index === 1 ? 'Good' : 'Fair'}
                        </Box>
                      </Box>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Match Score: {crop.matchScore}%
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Ideal pH:</strong> {crop.phMin}-{crop.phMax}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Needs:</strong> N: {crop.npk.n}, P: {crop.npk.p}, K: {crop.npk.k}
                      </Typography>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {crop.description}
                      </Typography>
                    </Paper>
                  ))}
                </Box>
              </Box>
            ) : soilData.tested ? (
              <Typography color="error">No suitable crops found for this soil type. Consider adjusting soil pH or nutrient levels.</Typography>
            ) : null}
          </Box>
        )}
      </Paper>
      
      {/* Game Section */}
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', mb: 2, color: '#2e7d32' }}>
        🌱 Interactive Farming Game
      </Typography>
      
      <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
        Day {day} • {gameState === 'selecting' ? 'Select a crop' : 
                   gameState === 'planting' ? 'Plant the crop' : 
                   gameState === 'watering' ? 'Water the plants' : 'Watch them grow!'}
      </Typography>

      <GameContainer elevation={3} ref={gameAreaRef}>
        <AnimatePresence>
          {showMessage && (
            <GameMessage
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </GameMessage>
          )}
        </AnimatePresence>

        <Farmer
          drag
          dragConstraints={gameAreaRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleFarmerDragStart}
          onDrag={handleFarmerDrag}
          onDragEnd={handleFarmerDragEnd}
          style={{
            x: farmerPosition.x,
            y: farmerPosition.y,
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <FarmGrid>
          {plots.map((plot, index) => (
            <FarmPlot 
              key={plot.id}
              className="farm-plot"
              data-id={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {plot.crop && (
                <>
                  <Crop
                    style={{
                      fontSize: `${getCropSize(plot.growth, plot.crop.growthTime) * 2}rem`,
                      color: plot.crop.color,
                    }}
                  >
                    {plot.crop.emoji}
                  </Crop>
                  {plot.waterLevel > 0 && (
                    <WaterIndicator 
                      style={{ 
                        width: `${(plot.waterLevel / plot.crop.waterNeeded) * 100}%`,
                        opacity: 0.7,
                      }} 
                    />
                  )}
                </>
              )}
            </FarmPlot>
          ))}
        </FarmGrid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" gutterBottom>Inventory</Typography>
            <Inventory>
              {inventory.map((item, index) => (
                <InventoryItem
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={selectedCrop?.id === item.crop?.id ? 'selected' : ''}
                  onClick={() => item.type === 'seed' && handleSelectCrop(item.crop)}
                >
                  {item.type === 'seed' ? (
                    <>
                      <span style={{ fontSize: '1.5rem' }}>{item.crop.emoji}</span>
                      <span>{item.crop.name} x{item.count}</span>
                    </>
                  ) : (
                    <>
                      <WaterDropIcon color="primary" fontSize="large" />
                      <span>Water x{item.count}</span>
                    </>
                  )}
                </InventoryItem>
              ))}
            </Inventory>
          </Box>
          
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleNextDay}
            startIcon={<DirectionsWalkIcon />}
            sx={{ height: 'fit-content' }}
          >
            Next Day
          </Button>
        </Box>
      </GameContainer>

      <Paper elevation={3} sx={{ p: 3, mt: 4, backgroundColor: '#fff' }}>
        <Typography variant="h6" gutterBottom>How to Play</Typography>
        <ol>
          <li>Select a seed from your inventory</li>
          <li>Drag the farmer to an empty plot to plant</li>
          <li>Select water and drag the farmer to water your plants</li>
          <li>Click "Next Day" to see your plants grow</li>
          <li>Harvest fully grown crops to earn rewards!</li>
        </ol>
      </Paper>
    </Container>
  );
};

export default InteractiveFarmGame;
