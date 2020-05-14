
import React, { Component } from 'react';
import {Dimensions , Text, View ,StyleSheet,TouchableOpacity, TextInput,ScrollView, ToastAndroid} from 'react-native';

import CheckboxField from 'react-native-checkbox-field';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AsyncStorage} from 'react-native';
import {  RFValue } from "react-native-responsive-fontsize";
import QRCode from 'react-native-qrcode-svg';
import { RNCamera } from 'react-native-camera';



export default class Mainscreen extends Component {


    constructor(props){
    super(props);
    this.state = {
        selectedOri1: false,
        selectedOri2: false,
        selectedDub1: false,
        selectedDub2: false,
        barcode:'hellow world',
        members:0,
        currentIndex:-1,
        data:this.getData() ,
        membersView:[],
        selectedSheet:'SPHH',
        sheets:{'SPHH':{active:1} ,'PHH':{active:0},'RKSY-1':{active:0},'RKSY-II':{active:0},'AAY':{active:0}},
        currentIndexAll:{'SPHH':{index:0} ,'PHH':{ndex:0},'RKSY-1':{index:0},'RKSY-II':{index:0},'AAY':{index:0}},
        password:'',
        shortText:'Enter comment',
        longText:'Enter comment',
        scanPage:false,
        readBarCode:0,
      };
    
      
    }



    getData = async () => {
        try{
            data=await AsyncStorage.getItem('data')
            
            data=JSON.parse(data);
            this.setState({data:data})
            console.log('Get data from storage to local variable=')
           // console.log(data);
        }
        catch(err){
            console.log(err)
        }
    }

    resetData = async () => {
        try{
            this.textInput.clear()
            if(this.state.password=='123456')
            {
                await AsyncStorage.setItem('data',JSON.stringify(this.props.data))
                this.getData()
                console.log('Done reseting')
                alert('Done master reset')
            }
            else if(this.state.password=='123'){
                var data1=this.state.data

                for(var sheetname in data1){
                    for(var i in data1[sheetname])
                    {   
                        data1[sheetname][i]['chk1']=false;
                        data1[sheetname][i]['chk2']=false;
                        data1[sheetname][i]['chk3']=false;
                        data1[sheetname][i]['chk4']=false;
  
                    }
                    
                }
                this.setState({data:data1});
                this.saveData();
                alert('Done reset')

                
            }
            else{
                alert('Enter the correct password')
            }
            this.setState({password:''})

        }
        catch(err){
            console.log(err)
        }
    }

    saveData = async () => {
        try{
            await AsyncStorage.setItem('data',JSON.stringify(this.state.data))
            console.log('Data Saved')
        }
        catch(err){
            console.log(err)
        }
    }


    




    selectCheckboxOri1 = () => {
        try{
        this.setState({
            selectedOri1: !this.state.selectedOri1,
        });
        var data=this.state.data;
        data[this.state.selectedSheet][this.state.currentIndex]["chk1"]=!this.state.selectedOri1;
        this.setState({data:data})
        this.saveData()
        }
        catch(ere){
            console.log('selectcheckboxori1',ere)
        }
    };


    selectCheckboxOri2 = () => {
        try{
            this.setState({
                selectedOri2: !this.state.selectedOri2,
            });
            var data=this.state.data;
            data[this.state.selectedSheet][this.state.currentIndex]["chk2"]=!this.state.selectedOri2;
            this.setState({data:data})
            this.saveData()
        }
        catch(ere){
            console.log('selectcheckboxori2',ere)
        }
    };
    

    selectCheckboxDb1 = () => {
        try{
            this.setState({
                selectedDub1: !this.state.selectedDub1,
            });
            var data=this.state.data;
            data[this.state.selectedSheet][this.state.currentIndex]["chk3"]=!this.state.selectedDub1;
            this.setState({data:data})
            this.saveData()
        }
        catch(ere){
            console.log('selectcheckboxdb1',ere)
        }
    };
    

    selectCheckboxDb2 = () => {
        try{
            this.setState({
                selectedDub2: !this.state.selectedDub2,
            });
            var data=this.state.data;
            data[this.state.selectedSheet][this.state.currentIndex]["chk4"]=!this.state.selectedDub2;
            this.setState({data:data})
            this.saveData()
        }
        catch(ere){
            console.log('selectcheckboxdb2',ere)
        }
    };


    shortText = () => {
        try{
            this.setState({
                selectedDub2: !this.state.selectedDub2,
            });
            var data=this.state.data;
            data[this.state.selectedSheet][this.state.currentIndex]["chk4"]=!this.state.selectedDub1;
            this.setState({data:data})
            this.saveData()
        }
        catch(ere){
            console.log('selectcheckboxdb2',ere)
        }
    };












    

    next = async ()=>{
         var p=await this.showNextFamily();
         this.getcheckboxdata();
         this.getShortText();
         this.getLongText();
    }
   
    showNextFamily=()=>{
        try{
            var index=this.state.currentIndex;
            var data=this.state.data
            index++
            var hof=data[this.state.selectedSheet][index]["HOF Name"]
            console.log(hof)
            tem=[]
            var ind
            for(var i=index;hof==data[this.state.selectedSheet][i]["HOF Name"];i++){
                tem.push(data[this.state.selectedSheet][i])
                ind=i
            }
            this.setState({members:ind-this.state.currentIndex})
            this.setState({currentIndex:ind})
            this.setState({membersView:tem})
            var RatnNo=data[this.state.selectedSheet][ind]["RC No"]
            this.setState({barcode: RatnNo})
           
        }
        catch(ere)
        {
            console.log('error in next family',ere)
            alert('No more data to show')
        }
    }
    
    previous = async ()=>{
        var a= await this.showPreviousFamily();
        this.getcheckboxdata();
        this.getShortText();
        this.getLongText();
    }

    showPreviousFamily=()=>{
        try{
            var index=this.state.currentIndex;
            if(index>0){
                var data=this.state.data
                var hof=data[this.state.selectedSheet][index]["HOF Name"]
                for(var i=index;hof==data[this.state.selectedSheet][i]["HOF Name"] ;i--){
                    index=i;
                    if(i==0)
                        break
                }
                index--;
                var ind=index;
                var tem=[]
                hof=data[this.state.selectedSheet][index]["HOF Name"];
                for(var i=index; hof==data[this.state.selectedSheet][i]["HOF Name"] ;i--){   
                    tem.push(data[this.state.selectedSheet][i])
                    index=i
                    if(i==0)
                    break
                }
                this.setState({members:ind-index+1})
                this.setState({currentIndex:ind})
                this.setState({membersView:tem.reverse()})
                var RatnNo=data[this.state.selectedSheet][ind]["RC No"]
                this.setState({barcode: RatnNo})
            }
        }
        catch(ere){
            console.log(ere)
            alert('No more data to show')
        }    
    }





    scan = async () => {
        try{
            var down
            var index=0
            var rcNo=this.state.password
            var data1=this.state.data
            var flag=0
            for(var sheetname in data1){
                for(var i in data1[sheetname])
                {   
                    if(data1[sheetname][i]['RC No']==rcNo){
                        index=i
                        flag=1
                        break
                    }
  
                }
                if(flag!=0){
                    break
                }
                    
            }

            var tem=[]
            this.textInput.clear()
            var hof=data[this.state.selectedSheet][index]["HOF Name"];

            if(flag!=0)
            {
                for(var i=index; hof==data[this.state.selectedSheet][i]["HOF Name"] ;i--){   
                    tem.push(data[this.state.selectedSheet][i])
                    down=i
                    if(i==0)
                    break
                }
                tem=tem.reverse()
                index++
                
                if(hof==data[this.state.selectedSheet][index]["HOF Name"]){
                    for(var i=index; hof==data[this.state.selectedSheet][i]["HOF Name"] ;i++){   
                        tem.push(data[this.state.selectedSheet][i])
                        index=i
                        
                    }
                }
                else{
                    index--
                }
                
                this.setState({members:index-down+1})
                await this.setState({currentIndex:index})
                this.setState({membersView:tem})
                var RatnNo=data[this.state.selectedSheet][index]["RC No"]
                this.setState({barcode: RatnNo})
                this.getcheckboxdata();

                this.getShortText();
                this.getLongText();


            }
            else
                alert('no member found')
        }
        catch(ere){
            console.log(ere)
        }
    }

    getShortText=()=>{
        var data=this.state.data;
        var index=this.state.currentIndex;
        try{
            var shortText=data[this.state.selectedSheet][index]["shortText"]
            if(typeof shortText=='undefined'){
                data[this.state.selectedSheet][index]["shortText"]='';
                this.setState({shortText:'Enter comment'})
            }
            else{
                this.setState({shortText:shortText})
            }

        }
        catch(ere){

        }
    }



    getLongText=()=>{
        var data=this.state.data;
        var index=this.state.currentIndex;
        try{
            var longText=data[this.state.selectedSheet][index]["longText"]
            if(typeof longText=='undefined'){
                data[this.state.selectedSheet][index]["longText"]='';
                this.setState({longText:'Enter description'})
            }
            else{
                this.setState({longText:longText})
            }

        }
        catch(ere){
            console.log('getLongText',ere)
        }
    }






    getcheckboxdata=()=>{
        var data=this.state.data;
        var index=this.state.currentIndex;
        try{
            
            console.log(index)
            //console.log(data.SPHH[index]["chk1"])
            
            console.log('step1')
            var chk1=data[this.state.selectedSheet][index]["chk1"]
            var chk2=data[this.state.selectedSheet][index]["chk2"]
            var chk3=data[this.state.selectedSheet][index]["chk3"]
            var chk4=data[this.state.selectedSheet][index]["chk4"]

            if(typeof chk1=='undefined'){
                console.log("Now time to reset the value")
                data[this.state.selectedSheet][index]["chk1"]=false
                data[this.state.selectedSheet][index]["chk2"]=false
                data[this.state.selectedSheet][index]["chk3"]=false
                data[this.state.selectedSheet][index]["chk4"]=false
                this.setState({data:data})
                this.setState({selectedOri1:false})
                this.setState({selectedOri2:false})
                this.setState({selectedDub1:false})
                this.setState({selectedDub2:false})
            }
            else{
                this.setState({selectedOri1:chk1})
                this.setState({selectedOri2:chk2})
                this.setState({selectedDub1:chk3})
                this.setState({selectedDub2:chk4})
            }
            

        }
        catch(ere){
            console.log(ere)
        }
    }




    selectSheet= async ({sheet})=>{

        //console.log(sheet)
        
        tem=this.state.sheets
        for (var sheetname in this.state.sheets){
            if(sheet==sheetname)
            {
               // console.log(this.state.sheets[sheetname])
               // tem=this.state.sheets
                tem[sheetname].active=1
                //this.state.sheets[sheetname]

            }
            else{
                tem[sheetname].active=0
            }
        }
        this.setState({sheets:tem})
        this.setState({selectedSheet:sheet})
        await this.setState({currentIndex: -1})
        this.next()
        //console.log(this.state.sheets)

    }

    handlePassword = (text) => {
        this.setState({ password: text })
        console.log(text)
     }

    handleShortText = async (text) => {
        this.setState({ shortText: text })
        console.log(text)
        try{
            var data=await this.state.data;
            data[this.state.selectedSheet][this.state.currentIndex]["shortText"]=text;
            this.setState({data:data})
            this.saveData()
        }
        catch(ere){
            console.log('handleShortText',ere)
        }

     }

     handleLongText = async (text) => {
        this.setState({ longText: text })
        console.log(text)
        try{
            var data=await this.state.data;
            data[this.state.selectedSheet][this.state.currentIndex]["longText"]=text;
            this.setState({data:data})
            this.saveData()
        }
        catch(ere){
            console.log('handleLongText',ere)
        }
     }
     getCamera=()=>{
         this.setState({scanPage:true})
     }
     goBack=()=>{
         this.setState({scanPage:false})
     }
     getQrCode= async (code)=>{
        await this.setState({password:code})
        await this.goBack()
        await this.scan()
     }

   // active='blue';
   // nonactiveColor='white';







































    render() {

        return(
      

        
        
            <View style={styles.container}>
                { this.state.scanPage == false &&
                <View style={styles.container}>
                <View style={styles.container1}> 
                    <View style={{width:'15%',justifyContent:'center',margin:'2%'}}>
                        <TouchableOpacity
                            onPress={()=>this.resetData()}
                            style={{ borderColor: 'white',backgroundColor:'#42CDC8' ,borderWidth: 1,width:'100%',alignItems:'center' }}
                        >
                            <Text style={{color:'white',fontSize:RFValue(19, 798)}}>RESET</Text>
                            
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'50%',justifyContent:'center',margin:'4%'}}>
                        <TextInput
                            placeholder={'ENTER PASSWORD'}
                             style={{ borderColor: 'white', borderWidth: 1,width:'100%',backgroundColor:'#42CDC8',fontSize:RFValue(15, 798),textAlign:'center' }}
                             keyboardType={'number-pad'}
                             onChangeText = {this.handlePassword}
                             ref={input => { this.textInput = input }}
                        />
                    </View>
                    
                    <View style={{width:'7%',justifyContent:'center',margin:'2%',marginLeft:0}}>
                       
                        <TouchableOpacity
                            onPress={()=> this.scan()}
                            style={{ width:'100%',height:'70%',alignItems:'center',backgroundColor:'#42CDC8',justifyContent:'center' }}
                        >
                            <Icon
                                name="search"
                                size={25}
                                color="#ffffff"
                            />
                        </TouchableOpacity>
                       
                    </View>
                    <View style={{width:'8%',justifyContent:'center',margin:'2%'}}>
                       
                        <TouchableOpacity
                            onPress={()=> this.getCamera()}
                            style={{ width:'100%',height:'60%',alignItems:'center',backgroundColor:'#42CDC8',justifyContent:'center' }}
                        >
                            <Icon
                                name="camera"
                                size={20}
                                color="#ffffff"
                            />
                        </TouchableOpacity>
                       
                    </View>
                </View>

                <View style={styles.container2}>
                    <View 
                    style={{flex:1,borderColor: 'white', borderWidth: 1,alignItems:'center',backgroundColor:this.state.sheets["SPHH"].active?'orange':'#4EAED6',justifyContent:'center'}}
                    >
                        <TouchableOpacity
                            style={{height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}}
                            onPress={()=>this.selectSheet({sheet:'SPHH'})}
                        >
                            <Text>SPHH</Text>
                        </TouchableOpacity>
                    </View>

                    <View 
                    style={{flex:1,borderColor: 'white', borderWidth: 1,alignItems:'center',backgroundColor:this.state.sheets["PHH"].active?'orange':'#4EAED6',justifyContent:'center'}}
                    >
                        <TouchableOpacity
                            style={{height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}}
                            onPress={()=>this.selectSheet({sheet:'PHH'})}
                        >
                            <Text>PHH</Text>
                        </TouchableOpacity>
                    </View>

                    <View 
                    style={{flex:1,borderColor: 'white', borderWidth: 1,alignItems:'center',backgroundColor:this.state.sheets["RKSY-1"].active?'orange':'#4EAED6',justifyContent:'center'}}
                    >
                        <TouchableOpacity
                            style={{height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}}
                            onPress={()=>this.selectSheet({sheet:'RKSY-1'})}
                        >
                            <Text>RKSY-1</Text>
                        </TouchableOpacity>
                    </View>

                    <View 
                    style={{flex:1,borderColor: 'white', borderWidth: 1,alignItems:'center',backgroundColor:this.state.sheets["RKSY-II"].active?'orange':'#4EAED6',justifyContent:'center'}}
                    >
                          <TouchableOpacity
                            style={{height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}}
                            onPress={()=>this.selectSheet({sheet:'RKSY-II'})}
                        >
                            <Text>RKSY-II</Text>
                        </TouchableOpacity>
                    </View>

                    <View 
                    style={{flex:1,borderColor: 'white', borderWidth: 1,alignItems:'center',backgroundColor:this.state.sheets['AAY'].active?'orange':'#4EAED6',justifyContent:'center'}}
                    >
                         <TouchableOpacity
                            style={{height:'100%',width:'100%',justifyContent:'center',alignItems:'center'}}
                            onPress={()=>this.selectSheet({sheet:'AAY'})}
                        >
                            <Text>AAY</Text>
                        </TouchableOpacity>
                    </View>

                   
                    
                </View>

                <View style={styles.container3}>

                    <View style={{flex:1,marginLeft:'10%',marginRight:'4%',justifyContent:'center'}}>
                        <CheckboxField
                        onSelect={this.selectCheckboxOri1}
                        selected={this.state.selectedOri1}
                        label="Week1"
                        labelSide="right"
                        >

                           <Icon name="check" color="white" />
                        </CheckboxField>
                    </View>

                    <View style={{flex:1,marginLeft:'10%',marginRight:'8%',justifyContent:'center'}}>
                        <CheckboxField
                        onSelect={this.selectCheckboxOri2}
                        selected={this.state.selectedOri2}
                        label="Week2"
                        labelSide="right"
                        >

                            <Icon name="check" color="#fff" />
                        </CheckboxField>
                    </View>
                </View>

                <View style={styles.container4}>
                    <View style={{flex:1,marginLeft:'10%',marginRight:'4%',justifyContent:'center'}}>
                        <CheckboxField
                        onSelect={this.selectCheckboxDb1}
                        selected={this.state.selectedDub1}
                        label=" DWeek1"
                        labelSide="right"
                        >

                            <Icon name="check" color="#fff" />
                        </CheckboxField>
                    </View>

                    <View style={{flex:1,marginLeft:'10%',marginRight:'8%',justifyContent:'center'}}>
                        <CheckboxField
                        onSelect={this.selectCheckboxDb2}
                        selected={this.state.selectedDub2}
                        label=" DWeek2"
                        labelSide="right"
                        >

                            <Icon name="check" color="#fff" />
                        </CheckboxField>
                    </View>
                </View>

                <View style={styles.container5}>
                    
                    <View style={{marginLeft:'2%',flex:1,flexDirection:'row'}}>
                        <View style={{flex:1}}>
                            <View style={{height:'45%',width:'100%'}}>
                                <Text 
                                    style={{fontSize:RFValue(20, 798),height:'40%'}}
                                >
                                        Members:  {this.state.members}
                                </Text>
                                <TextInput 
                                    value={this.state.shortText} 
                                    style={{backgroundColor:'#7CAECD',height:'50%',fontSize:RFValue(15, 798),textAlign:'center',borderRadius:RFValue(7, 798),paddingVertical: 0}} 
                                    onChangeText = {this.handleShortText}
                                    ref={input => { this.commentInput = input }}
                                />
                            </View>
                            <View style={{}}>
                                
                                <QRCode
                                    value={this.state.barcode} 
                                    backgroundColor={'powderblue'}
                                    size={RFValue(120, 798)}
                                />
                                
                            </View>
                        </View>
                        <View style={{flex:1.2}}> 
                            <TextInput 
                                multiline 
                                style={{margin:'5%',backgroundColor:'#7CAECD',height:'90%',fontSize:RFValue(20, 798),color:'black',fontWeight:'bold',textAlign:'center',borderRadius:RFValue(7, 798)}}
                                value={this.state.longText} 
                                onChangeText = {this.handleLongText}
                                ref={input => { this.commentInput = input }}
                            />
                        </View>

                    </View>
                </View>

                <View style={styles.container6}>

                

                <ScrollView
                   
                  // contentContainerStyle={this.state.content}
                >

                    <View style={{flex:1,height:RFValue(600, 798)}}>
                        <ScrollView
                        horizontal={true}
                    // style={{flexDirection:'column'}}
                    // showsHorizontalScrollIndicator = {false}
                        >
                            <View style={{height:'60%',backgroundColor:'#5A538A'}}>
                                {/*Show table*/}
                                <View style={{flexDirection:'row',height:'10%'}}>
                                    <View style={styles.contentHeaderView}><Text style={styles.text}>Rc no</Text></View>
                                    <View style={styles.contentHeaderView}><Text style={styles.text}>Name</Text></View>
                                    <View style={styles.contentHeaderView}><Text style={styles.text}>Hod</Text></View>
                                    <View style={styles.contentHeaderView}><Text style={styles.text}>Category</Text></View>
                                    <View style={styles.contentHeaderView}><Text style={styles.text}>Guarden</Text></View>
                                    <View style={styles.contentHeaderView}><Text style={styles.text}>Gender</Text></View>
                                    <View style={styles.contentHeaderView}><Text style={styles.text}>Relation</Text></View>
                                    <View style={styles.contentHeaderView}><Text style={styles.text}>Age</Text></View>
                                    <View style={styles.contentHeaderView}><Text style={styles.text}>Status</Text></View>
                                </View>


                                { 
                                this.state.membersView.map((family,index)=>(
                                
                                <View style={{flexDirection:'row',height:'10%',marginVertical:6}}>
                                    <View style={styles.childcontentHeaderView}><Text style={styles.childtext}>{family['RC No']}</Text></View>
                                    <View style={styles.childcontentHeaderView}><Text style={styles.childtext}>{family['Name']}</Text></View>
                                    <View style={styles.childcontentHeaderView}><Text style={styles.childtext}>{family['HOF Name']}</Text></View>
                                    <View style={styles.childcontentHeaderView}><Text style={styles.childtext}>{family['RC Category']}</Text></View>
                                    <View style={styles.childcontentHeaderView}><Text style={styles.childtext}>{family['Father/Husband Name']}</Text></View>
                                    <View style={styles.childcontentHeaderView}><Text style={styles.childtext}>{family['Gender']}</Text></View>
                                    <View style={styles.childcontentHeaderView}><Text style={styles.childtext}>{family['Relation']}</Text></View>
                                    <View style={styles.childcontentHeaderView}><Text style={styles.childtext}>{family['Age']}</Text></View>
                                    <View style={styles.childcontentHeaderView}><Text style={styles.childtext}>{family['Status']}</Text></View>
                                </View>
                                
                                ))
                                }


                            </View>
                        </ScrollView>
                    </View>
                </ScrollView>
                </View>

                <View style={styles.container7}>
                    <View>
                        <Text style={{color:'white',fontSize:RFValue(18, 798),paddingLeft:10}}>
                            INDEX
                        </Text>
                    </View>
                    <View>
                        <Text style={{color:'white',fontSize:RFValue(18, 798),paddingLeft:10}}>
                            {this.state.currentIndex}
                        </Text>
                    </View>
                    <View>
                        {/*textinput*/}
                    </View>
                </View>

                <View style={styles.container8}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity 
                            style={{alignItems:'center',justifyContent:'center',backgroundColor:'#3E324C',width:'80%',height:'50%'}}
                            onPress={()=>this.previous()}
                        >
                            <Text style={{color:'white',}}>Previous</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity 
                            style={{alignItems:'center',justifyContent:'center',backgroundColor:'#3E324C',width:'80%',height:'50%'}}
                            onPress={()=>this.next()}
                            >
                            <Text style={{color:'white',}}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </View>
                }   
                {this.state.scanPage==true &&
                    <View style={{flex: 1}}>
                        <TouchableOpacity
                            style={{flex:0.1,backgroundColor:'#42CDC8',justifyContent:'center',alignItems:'center'}}
                            onPress={()=>this.goBack()}
                        >
                            <Text style={{flex:1,textAlignVertical:'center',justifyContent:'center',color:'white',alignItems:'center',fontSize:20,fontWeight:'bold'}}>Back </Text>
                        </TouchableOpacity>
                        <RNCamera
                            ref={ref => {
                                this.camera = ref;
                            }}
                            style={{flex: 1}}
                            onBarCodeRead={(data)=> this.getQrCode(data.data)} >
                        </RNCamera>
                    </View>
                }    
            </View>
        
        
        )
    }
}

const styles= StyleSheet.create({
    container:{
       
        backgroundColor:'#524365',
        flex:1,
        position: 'absolute',
        bottom: 0, 
        top: 0, 
        width: '100%', 
        height: Dimensions.get('window').height, 
        minHeight: Dimensions.get('window').height,
    },
    container1:{
        height:'10%',
        backgroundColor:'#42CDC8',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        
    },
    container2:{
        height:'6%',
        backgroundColor:'green',
        flexDirection:'row',
    },
    container3:{
        height:'5%',
        backgroundColor:'#497BB4',
        flexDirection:'row',
    },
    container4:{
        height:'5%',
        backgroundColor:'#497BB4',
        flexDirection:'row',
        
    },
    container5:{
        height:'30%',
        backgroundColor:'powderblue',
        borderColor: 'white', 
        borderWidth: 1,
    },
    container6:{
        height:'30%',
        backgroundColor:'#5A538A',
    },
    container7:{
        height:'3%',
        backgroundColor:'#524365',
        borderColor: '#888077', 
        borderTopWidth: 1,
        flexDirection:'row'
    },
    container8:{
        height:'8%',
        backgroundColor:'#524365',
        flexDirection:'row',
    },

    headerSearch:{

    },

    contentHeaderView:{
        backgroundColor:'#837FA8',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        height:'100%',
        width:RFValue(125, 798),
        margin:RFValue(4, 798),
    },
    childcontentHeaderView:{
        backgroundColor:'#837FA8',
        justifyContent:'center',
        textAlignVertical:'center',
        alignItems:'center',
        borderRadius:5,
        height:'100%',
        width:RFValue(125, 798),
        margin:RFValue(4, 798),

    },

    text:{
        fontSize:RFValue(21, 798),
        color:'white',
    },
    childtext:{
        fontSize:RFValue(11, 798),
        color:'white',
    }
});
