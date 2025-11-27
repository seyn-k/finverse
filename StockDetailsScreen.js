import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
  },
  timeFrameButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
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
  bsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  bsHeaderContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bsStockSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  bsStockPrice: {
    fontSize: 12,
    color: '#6b7280',
  },
  bsStockChange: {
    color: '#10b981',
  },
  depthText: {
    color: '#6b7280',
    fontSize: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  inputContainer: {
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    color: '#3b82f6',
    width: 100,
  },
  inputWrapper: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    minWidth: 100,
    alignItems: 'center',
  },
  activeInput: {
    borderBottomColor: '#3b82f6',
    borderBottomWidth: 2,
  },
  inputValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  actionContainer: {
    padding: 16,
  },
  mainActionButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  mainActionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  key: {
    width: '33.33%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  keyText: {
    fontSize: 24,
    color: '#111',
    fontWeight: '500',
  },
  paymentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  paymentHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 4,
  },
  paymentSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  paymentMethodList: {
    padding: 16,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#3b82f6',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b82f6',
  },
  payButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  payButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const timeFrames = ['1D', '1W', '1M', '3M', '1Y', 'All'];

const StockDetailsScreen = ({ route, navigation }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('1D');
  const { stock } = route?.params || {};

  // Buy/Sell/Payment state
  const [viewMode, setViewMode] = useState('details'); // 'details', 'buy', 'sell', 'payment'
  const [orderType, setOrderType] = useState('Delivery');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [activeInput, setActiveInput] = useState('quantity');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const formatMarketCap = (value) => {
    if (!value) return '$0';
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${Number(value).toLocaleString()}`;
  };

  const formatPrice = (value) => {
    if (value === undefined || value === null || value === '') return '$0.00';
    return `$${parseFloat(value).toFixed(2)}`;
  };

  const isPositiveChange = (stock?.change || 0) >= 0;

  const handleKeyPress = (key) => {
    if (key === 'backspace') {
      if (activeInput === 'quantity') {
        setQuantity((prev) => prev.slice(0, -1));
      } else {
        setPrice((prev) => prev.slice(0, -1));
      }
    } else if (key === '.') {
      if (activeInput === 'quantity') {
        if (!quantity.includes('.')) setQuantity((prev) => prev + key);
      } else {
        if (!price.includes('.')) setPrice((prev) => prev + key);
      }
    } else {
      if (activeInput === 'quantity') {
        setQuantity((prev) => prev + key);
      } else {
        setPrice((prev) => prev + key);
      }
    }
  };

  const renderBuySellView = () => {
    const isBuy = viewMode === 'buy';
    const themeColor = isBuy ? '#10b981' : '#ef4444';

    return (
      <SafeAreaView style={stockStyles.stockContainer}>
        {/* Header */}
        <View style={stockStyles.bsHeader}>
          <TouchableOpacity onPress={() => setViewMode('details')} style={stockStyles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <View style={stockStyles.bsHeaderContent}>
            <View>
              <Text style={stockStyles.bsStockSymbol}>{stock?.symbol || 'N/A'}</Text>
              <Text style={stockStyles.bsStockPrice}>
                NSE {formatPrice(stock?.price || 0)}{' '}
                <Text style={[stockStyles.bsStockChange, { color: isPositiveChange ? '#10b981' : '#ef4444' }]}>({stock?.change || '0'}%)</Text>
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={stockStyles.depthText}>Depth</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Type Toggle */}
        <View style={stockStyles.toggleContainer}>
          <TouchableOpacity
            style={[
              stockStyles.toggleButton,
              orderType === 'Delivery' && { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
            ]}
            onPress={() => setOrderType('Delivery')}
          >
            <Text style={[stockStyles.toggleText, orderType === 'Delivery' && { color: '#fff' }]}>Delivery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              stockStyles.toggleButton,
              orderType === 'Intraday' && { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
            ]}
            onPress={() => setOrderType('Intraday')}
          >
            <Text style={[stockStyles.toggleText, orderType === 'Intraday' && { color: '#fff' }]}>Intraday</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View style={stockStyles.inputContainer}>
          <View style={stockStyles.inputRow}>
            <Text style={stockStyles.inputLabel}>Qty NSE</Text>
            <TouchableOpacity
              style={[stockStyles.inputWrapper, activeInput === 'quantity' && stockStyles.activeInput]}
              onPress={() => setActiveInput('quantity')}
            >
              <Text style={stockStyles.inputValue}>{quantity || '0'}</Text>
            </TouchableOpacity>
          </View>

          <View style={stockStyles.actionContainer}>
            <TouchableOpacity
              style={[stockStyles.mainActionButton, { backgroundColor: themeColor }]}
              onPress={() => setViewMode('payment')}
            >
              <Text style={stockStyles.mainActionButtonText}>{isBuy ? 'Buy' : 'Sell'}</Text>
            </TouchableOpacity>

            <View style={stockStyles.footerInfo}>
              <Text style={stockStyles.footerText}>Balance: $12,345.67</Text>
              <Text style={stockStyles.footerText}>Margin(5.00x): 50</Text>
            </View>
          </View>

          {/* Numeric Keypad */}
          <View style={stockStyles.keypad}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((k) => (
              <TouchableOpacity key={k} style={stockStyles.key} onPress={() => handleKeyPress(k)}>
                <Text style={stockStyles.keyText}>{k}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={stockStyles.key} onPress={() => handleKeyPress('backspace')}>
              <MaterialIcons name="backspace" size={24} color="#111" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  };

  const renderPaymentView = () => {
    return (
      <SafeAreaView style={stockStyles.paymentContainer}>
        <View style={stockStyles.paymentHeader}>
          <TouchableOpacity onPress={() => setViewMode('buy')} style={{ marginBottom: 16, alignSelf: 'flex-start' }}>
            <MaterialIcons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={stockStyles.paymentTitle}>Confirm your order</Text>
          <Text style={stockStyles.paymentSubtitle}>Payment method</Text>
        </View>

        <View style={stockStyles.paymentMethodList}>
          {['UPI', 'Netbanking', 'Debit Card'].map((method) => (
            <TouchableOpacity key={method} style={stockStyles.paymentMethodItem} onPress={() => setPaymentMethod(method)}>
              <Text style={stockStyles.paymentMethodText}>{method}</Text>
              <View style={[stockStyles.radioButton, paymentMethod === method && stockStyles.radioButtonSelected]}>
                {paymentMethod === method && <View style={stockStyles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        <View style={stockStyles.payButtonContainer}>
          <TouchableOpacity
            style={stockStyles.payButton}
            onPress={() => {
              // Simulate payment success
              navigation.goBack();
            }}
          >
            <Text style={stockStyles.payButtonText}>Pay $550</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  if (viewMode === 'buy' || viewMode === 'sell') {
    return renderBuySellView();
  }

  if (viewMode === 'payment') {
    return renderPaymentView();
  }

  // Default Details View
  return (
    <SafeAreaView style={stockStyles.stockContainer}>
      <View style={stockStyles.stockHeader}>
        <TouchableOpacity style={stockStyles.backButton} onPress={() => navigation.goBack()}>
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
              { backgroundColor: isPositiveChange ? '#e6f4ea' : '#fce8e8' },
            ]}
          >
            <MaterialIcons name={isPositiveChange ? 'arrow-upward' : 'arrow-downward'} size={16} color={isPositiveChange ? '#4CAF50' : '#F44336'} />
            <Text style={[stockStyles.priceChange, { color: isPositiveChange ? '#4CAF50' : '#F44336' }]}>
              {isPositiveChange ? '+' : ''}{stock?.change || 0}%
            </Text>
          </View>
        </View>

        <View style={stockStyles.timeFrameSelector}>
          {timeFrames.map((frame) => (
            <TouchableOpacity
              key={frame}
              style={[stockStyles.timeFrameButton, selectedTimeFrame === frame && stockStyles.timeFrameButtonActive]}
              onPress={() => setSelectedTimeFrame(frame)}
            >
              <Text style={[stockStyles.timeFrameText, selectedTimeFrame === frame && stockStyles.timeFrameTextActive]}>{frame}</Text>
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
          <TouchableOpacity style={[stockStyles.actionButton, stockStyles.buyButton]} onPress={() => setViewMode('buy')}>
            <Text style={stockStyles.buttonText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[stockStyles.actionButton, stockStyles.sellButton]} onPress={() => setViewMode('sell')}>
            <Text style={stockStyles.buttonText}>Sell</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StockDetailsScreen;