/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NetworkContext} from '../provider/Provider';

function HeaderRight({
  toggleSearch,
  searchQuery,
  setSearchQuery,
  fetchStudentByLogin,
}) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TextInput
        style={{
          height: 40,
          borderColor: 'black',
          borderWidth: 2,
          marginRight: 5,
          paddingHorizontal: 20,
          borderRadius: 10,
          backgroundColor: '#4B46FB',
        }}
        placeholder="Student login"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => {
          toggleSearch();
          if (searchQuery) {
            fetchStudentByLogin();
          }
        }}>
        <Ionicons name="search-outline" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchButton: {
    backgroundColor: '#4B46FB',
    marginRight: 10,
    borderRadius: 10,
  },
});

export default HeaderRight;
