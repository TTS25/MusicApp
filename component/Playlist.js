import React,{Component} from 'react';
import {
    SectionList, StyleSheet, Text, View,
    Alert, Image,TouchableHighlight, ImageBackground
}from 'react-native';
import {sectionListData} from '../data/sectionListData';
import AddModal from './AddModal';
import AddModalSong from './AddModalSong';
import Swipeout from 'react-native-swipeout';

class SectionListItem extends Component{
    render(){
        return(
            <ImageBackground source={require('../images/khoi3d3.jpg')} style={{flex:1}}>
                <View style={{flex:1,flexDirection:'column', backgroundColor: 'rgba(52, 52, 52, 0.2)'}}>
                    <View style={{ flex:1,flexDirection:'row'}}>
                        <Image
                            source={{uri: this.props.item.imageUrl}}
                            style={{width:45,height:45,margin:2}}/>
                        <View style={{
                            flex:1,
                            flexDirection:'column'
                        }}>
                            <Text style={{
                                fontSize:17,
                                fontWeight:'bold',
                                color:'white',
                                marginLeft:20,
                                marginRight:10,
                            }}>{this.props.item.name}</Text>
                            <Text style={{
                                fontSize:15,
                                color:'white',
                                marginLeft:20,
                                marginRight:10,
                            }}>{this.props.item.description}</Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        );
    }
}

class SectionHeader extends Component{
    constructor(props){
        super(props);
        this.state={
            activeRowKey:null
        };
        this._onPressAdd=this._onPressAdd.bind(this);
    }

    _onPressAdd(){
        this.refs.addModalsong.showAddModal();
    }
    
    render(){
        const swipeSettings = {
            autoClose:true,
            onClose:(secId, rowId, direction)=>{
                if(this.state.activeRowKey!=null){
                    this.setState({activeRowKey:null});
                }

            },
            onOpen:(secId, rowId, direction)=>{
                this.setState({activeRowKey:this.props.section.key});

            },
            right:[
                {
                    onPress:()=>{
                        const  deletingRow=this.state.activeRowKey;
                        Alert.alert(
                            'Cảnh báo',
                            'Bạn có chắc muốn xoá không?',
                            [
                                {text:'Không', onPress:()=>console.log('Cancel Presses'),style:'cancel'},
                                {text:'Có',onPress:()=>{
                                        sectionListData.splice(this.props.index, 1);
                                        this.props.parentSectionList.refreshSectionList(deletingRow);
                                    }},
                            ],
                            {cancelable:true}
                        );

                    },
                    text:'Xoá', type:'delete'
                },
            ],
            rowId: this.props.index,
            sectionId: 1
        };
       
        return (
                <Swipeout {...swipeSettings}>
                <ImageBackground source={require('../images/khoi3d3.jpg')} style={{flex:1}}>
                    <View style={{flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.4)',
                    flexDirection:'row',
                    justifyContent:'flex-start',
                    alignItems:'center'}}>
                        <Text style={{
                            fontSize:20,
                            fontWeight:'bold',
                            color:'white',
                            margin:10
                        }}>{this.props.section.title}

                        </Text>
                        <View>
                            <TouchableHighlight style={{marginRight:5}}
                                                underlayColor='rgba(52,52,52,0.6)'
                                                onPress={this._onPressAdd}
                            >
                                <Image style={{width:40,height:40, tintColor: 'white'}}
                                    source={require('../icon/thembai.png')}

                                />

                            </TouchableHighlight>
                        </View>
                        <AddModalSong ref={'addModalsong'} parentSectionList={this} >
                        </AddModalSong>
                    </View>
                    </ImageBackground>
                </Swipeout>
        );
    }
}

export default class Playlist extends Component{
    constructor(props){
        super(props);
        this._onPressAdd=this._onPressAdd.bind(this);
    }

    refreshSectionList=(activeKey,deleteKey)=>{
        this.setState((prevState)=>{
            return{
                deleteRowKey:activeKey,deleteKey
            };
        });

    }

    _onPressAdd(){
       this.refs.addModal.showAddModal();

    }

    render(){
        return(
            <ImageBackground source={require('../images/khoi3d3.jpg')} style={{flex:1}}>
                <View style={{flex:12}}>
                    <View style={{
                        flex: 1,
                        flexDirection:'row',
                        justifyContent:'flex-start',
                        alignItems:'center',
                        marginLeft: 15, marginBottom: 10
                    }}>
                            <Image style={{width:22,height:22, marginRight: 10, tintColor: 'white'}}
                                source={require('../icon/playlist.png')}/>
                            <Text style={{fontSize: 22, color:'white',fontFamily: "Helvetica Neue"}}>Danh sách phát</Text>
                            <TouchableHighlight style={{marginLeft: 120 ,marginRight: 15}}
                                                underlayColor="rgba(52, 52, 52, 0.6)"
                                                onPress={this._onPressAdd}>
                                <Image style={{width:25,height:25, tintColor: 'white'}}
                                    source={require('../icon/add.png')}/>
                            </TouchableHighlight>
                    </View>
                </View>
                <View style={{flex:88}}>
                    <SectionList
                        renderItem={({item, index})=>{
                            return(
                                <SectionListItem item={item} index={index} parentSectionList={this}/>
                            );
                        }}
                        renderSectionHeader={({section})=>{
                            return(
                                <SectionHeader section={section} parentSectionList={this}/>
                            );
                        }}
                        sections={sectionListData}
                        keyExtractor={(item, index)=>item.name}
                    />
                    <AddModal ref={'addModal'} parentSectionList={this}>
                    </AddModal>
                </View>
            </ImageBackground>
        );
    }
}