import { View, Text,StyleSheet,TouchableOpacity,TextInput, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import {useNavigation, useRouter} from 'expo-router';
import { Colors } from '../../../constant/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import {auth} from './../../../configs/FirebaseConfig'
import { createUserWithEmailAndPassword } from "firebase/auth";


export default function SignUp() {
  const navigation=useNavigation();
  const router=useRouter();

  const [email,setEmail]=useState();
  const [password,setPassword]=useState();
  const [fullName,setFullName]=useState();

  useEffect(()=>{
    navigation.setOptions({
      headerShown:false
    });
  },[]);

  const OnCreateAccount=()=>{
    if(!email || !password || !fullName)
    {
      ToastAndroid.show('please enter all details',ToastAndroid.LONG)
      return;

    }
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    console.log(user);
    router.replace('/home')
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage,errorCode);
    // ..
  });
  }
  return (
    <View style={{
      padding:25,
      paddingTop:15,
      backgroundColor:Colors.WHITE,
      height:'100%'
    }}>
<TouchableOpacity onPress={() => navigation.goBack()}>
<Ionicons name="arrow-back" size={24} color="black" />
</TouchableOpacity>
      
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:30,
        marginTop:30,
        
      }}>Create New Account</Text>
      {/*user full name*/}
      <View style={{
              marginTop:50,
      
      
            }}>
              <Text style={{
                fontFamily:'outfit-medium',
                fontSize:20,
              }}>FullName</Text>
              <TextInput
              style={styles.input} 
              placeholder='Enter your name'
              onChangeText={(value)=>setFullName(value)}
              
              />
            </View>
       <View style={{
              marginTop:50,
      
      
            }}>
              <Text style={{
                fontFamily:'outfit-medium',
                fontSize:20,
              }}>Email</Text>
              <TextInput
              style={styles.input} 
              placeholder='Enter Email'
              onChangeText={(value)=>setEmail(value)}
              />
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
              placeholder='Enter Password'
              onChangeText={(value)=>setPassword(value)}
              />
            </View>
            <TouchableOpacity  onPress={OnCreateAccount} style={{
              padding:20,
              backgroundColor:Colors.PURPLE,
              borderRadius:15,
              marginTop:50,
            }}>
             {/* Sign in Button */}
             <Text style={{
              color:Colors.WHITE,
              textAlign:'center'
             }}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
                  onPress={()=>router.replace('auth/Sign-In')}
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
                   }}>Sign in</Text>
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