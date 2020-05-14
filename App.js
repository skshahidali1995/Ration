/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, { Component } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
} from 'react-native';
import Mainscreen from './screen/Mainscreen'
import data from './File/data.json'

export default class App extends Component {
  constructor(props)
  {
    super(props)
    this.state={
      loading:true,
      datasource:[],
    }
  }
  componentDidMount()
  {
    this.setState({loading : false});
    this.state.datasource=data;
    
  }
  render() {

      if(this.state.loading){
        return(
          <View style={styles.container}>
              <Text>Data is loading</Text>
          </View>
        );
      }

      else{
      return (
          <View style={styles.container}>
              <Mainscreen data={this.state.datasource}/>
          </View>
      )
      }
  }
}


const styles = StyleSheet.create({
 container:{
   flex:1,
   width:'100%',
   height:'100%',
 }
});

