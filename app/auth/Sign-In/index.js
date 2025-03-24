import { View, Text, TextInput ,StyleSheet, TouchableOpacity, ToastAndroid} from 'react-native'
import React, { useEffect, useState } from 'react'
import {useNavigation, useRouter} from 'expo-router';
import { Colors } from './../../../constant/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import {auth} from './../../../configs/FirebaseConfig'
import {signInWithEmailAndPassword } from "firebase/auth";


export default function SignIn() {
  const navigation=useNavigation();
  const router=useRouter();

const [email,setEmail]=useState();
const [password,setPassword]=useState();

  useEffect(()=>{
    navigation.setOptions({
      headerShown:false
    });

  },[])



const onSignIn=()=>{
  if(!email&&!password)
  {
    ToastAndroid.show('please enter email and password',ToastAndroid.LONG);
    return;
  }


  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    router.replace('/home')
    console.log(user);
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage,errorCode)
    if(errorCode=='auth/invalid-email')
    {
      ToastAndroid.show("invalid email",ToastAndroid.LONG)
    }
  });
}

  return (
    <View style={{
      padding:25,
      paddingTop:40,
      backgroundColor:Colors.WHITE,
      height:'100%'
    }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:45,
        marginTop:25
      }}>Access Account!</Text>
       <Text style={{
        fontFamily:'outfit-medium',
        fontSize:30,
        marginTop:25,
        color:Colors.PRIMARY,
      }}>Check out your Pet's Feeding Habbits</Text>
       {/*email*/}
      <View style={{
        marginTop:50,


      }}>
        <Text style={{
          fontFamily:'outfit-medium',
          fontSize:20,
        }}>Email</Text>
        <TextInput
        style={styles.input}
        onChangeText={(value)=>setEmail(value)} 
        placeholder='Enter Email'/>
      </View>
      {/*password*/}
      
       
      <View style={{
        marginTop:20,


      }}>
        <Text style={{
          fontFamily:'outfit-medium',
          fontSize:20,
        }}>Password</Text>
        <TextInput
        secureTextEntry={true}
        style={styles.input} 
        onChangeText={(value)=>setPassword(value)}
        placeholder='Enter Password'/>
      </View>
      <TouchableOpacity onPress={onSignIn} style={{
        padding:20,
        backgroundColor:Colors.PURPLE,
        borderRadius:15,
        marginTop:50,
      }}>
       {/* Sign in Button */}
       <Text style={{
        color:Colors.WHITE,
        textAlign:'center'
       }}>Sign In</Text>
      </TouchableOpacity>
      {/*create account*/}
      <TouchableOpacity
      onPress={()=>router.replace('auth/Sign-Up')}
       style={{
      padding:20,
        backgroundColor:Colors.WHITE,
        borderRadius:15,
        marginTop:20,
      }}>
       {/* Sign up Button */}
       <Text style={{
        color:Colors.PURPLE,
        textAlign:'center'
       }}>Sign Up</Text>
       </TouchableOpacity>
      </View>
    
  )
}
const styles = StyleSheet.create({
  input:{
    padding:15,
    borderWidth:3,
    borderRadius:15,
    borderColor:Colors.PRIMARY,
    fontFamily:'outfit'


  }

})