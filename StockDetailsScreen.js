import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const stockStyles = StyleSheet.create({
  stockContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingBottom: 16,
  },
  stockHeader: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  stockHeaderContent: {
    marginTop: 16,
  },
  stockSymbol: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  stockName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  stockExchange: {
    fontSize: 14,
    color: '#999',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  priceContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  currentPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  priceChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  priceChange: {
    fontSize: 15,
    marginLeft: 4,
    fontWeight: '600',
  },
  timeFrameSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 8,
  },
  timeFrameButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  timeFrameButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  timeFrameText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
  },
  timeFrameTextActive: {
    color: '#fff',
  },
  chartContainer: {
    height: 250,
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 16,
  },
  chartPlaceholder: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  chartPlaceholderText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 14,
  },
  statValue: {
    color: '#111',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  buyButton: {
    backgroundColor: '#4CAF50',
  },
  sellButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const timeFrames = ['1D', '1W', '1M', '3M', '1Y', 'All'];

const StockDetailsScreen = ({ route, navigation }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('1D');
  const { stock } = route.params;
  
  const formatMarketCap = (value) => {
    if (!value) return '$0';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatPrice = (value) => {
    if (!value) return '$0.00';
    return `$${parseFloat(value).toFixed(2)}`;
  };

  const isPositiveChange = (stock?.change || 0) >= 0;


  return (
    <SafeAreaView style={stockStyles.stockContainer}>
      <View style={stockStyles.stockHeader}>
        <TouchableOpacity
          style={stockStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <View style={stockStyles.stockHeaderContent}>
          <Text style={stockStyles.stockSymbol}>{stock?.symbol || 'N/A'}</Text>
          <Text style={stockStyles.stockName}>{stock?.name || 'Unknown Stock'}</Text>
          <Text style={stockStyles.stockExchange}>{stock?.exchange || 'NYSE'}</Text>
        </View>
      </View>

      <ScrollView>
        <View style={stockStyles.priceContainer}>
          <Text style={stockStyles.currentPrice}>{formatPrice(stock?.price)}</Text>
          <View
            style={[
              stockStyles.priceChangeContainer,
              {
                backgroundColor: isPositiveChange ? '#e6f4ea' : '#fce8e8',
              },
            ]}
          >
            <MaterialIcons
              name={isPositiveChange ? 'arrow-upward' : 'arrow-downward'}
              size={16}
              color={isPositiveChange ? '#4CAF50' : '#F44336'}
            />
            <Text
              style={[
                stockStyles.priceChange,
                { color: isPositiveChange ? '#4CAF50' : '#F44336' },
              ]}
            >
              {isPositiveChange ? '+' : ''}{stock?.change || 0}%
            </Text>
          </View>
        </View>

        <View style={stockStyles.timeFrameSelector}>
          {timeFrames.map((frame) => (
            <TouchableOpacity
              key={frame}
              style={[
                stockStyles.timeFrameButton,
                selectedTimeFrame === frame && stockStyles.timeFrameButtonActive,
              ]}
              onPress={() => setSelectedTimeFrame(frame)}
            >
              <Text
                style={[
                  stockStyles.timeFrameText,
                  selectedTimeFrame === frame && stockStyles.timeFrameTextActive,
                ]}
              >
                {frame}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={stockStyles.chartContainer}>
          <View style={stockStyles.chartPlaceholder}>
            <MaterialIcons name="show-chart" size={24} color="#64748b" />
            <Text style={stockStyles.chartPlaceholderText}>Chart coming soon</Text>
          </View>
        </View>

        <View style={stockStyles.statsContainer}>
          <View style={stockStyles.statItem}>
            <Text style={stockStyles.statLabel}>Open</Text>
            <Text style={stockStyles.statValue}>{formatPrice(stock?.open)}</Text>
          </View>
          <View style={stockStyles.statItem}>
            <Text style={stockStyles.statLabel}>High</Text>
            <Text style={stockStyles.statValue}>{formatPrice(stock?.high)}</Text>
          </View>
          <View style={stockStyles.statItem}>
            <Text style={stockStyles.statLabel}>Low</Text>
            <Text style={stockStyles.statValue}>{formatPrice(stock?.low)}</Text>
          </View>
          <View style={stockStyles.statItem}>
            <Text style={stockStyles.statLabel}>52 Week High</Text>
            <Text style={stockStyles.statValue}>{formatPrice(stock?.yearHigh)}</Text>
          </View>
          <View style={stockStyles.statItem}>
            <Text style={stockStyles.statLabel}>52 Week Low</Text>
            <Text style={stockStyles.statValue}>{formatPrice(stock?.yearLow)}</Text>
          </View>
          <View style={stockStyles.statItem}>
            <Text style={stockStyles.statLabel}>Market Cap</Text>
            <Text style={stockStyles.statValue}>{formatMarketCap(stock?.marketCap)}</Text>
          </View>
        </View>

        <View style={stockStyles.actionButtons}>
          <TouchableOpacity style={[stockStyles.actionButton, stockStyles.buyButton]}>
            <Text style={stockStyles.buttonText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[stockStyles.actionButton, stockStyles.sellButton]}>
            <Text style={stockStyles.buttonText}>Sell</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StockDetailsScreen;