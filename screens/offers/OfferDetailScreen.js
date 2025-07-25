import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OfferDetailScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Offer Detail Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default OfferDetailScreen;
