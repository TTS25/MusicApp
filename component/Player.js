import React, {Component} from 'react'
import{
    Image, StatusBar,
    Dimensions,
    StyleSheet,
    Text, ImageBackground,
    View, Animated,
    Easing,
    TouchableOpacity
  } from 'react-native';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import Slider from 'react-native-slider';
import Video from 'react-native-video';
import picBg from '../images/hinh-nen.jpg'
import FavoriteList from '../data/FavoriteList';
import {Actions} from 'react-native-router-flux';

const {width} = Dimensions.get('window');

export default class Player extends Component {
    constructor(props){
        super(props);
        this.state = {
            playing: true,
            muted: false,
            repeat: false,
            shuffle: false,
            sliding: false,
            currentTime: 0,
            songIndex: props.songIndex,
        };
        this.spinValue= new Animated.Value(0);
    }

    togglePlay(){
        this.setState({ playing: !this.state.playing });
    }

    toggleVolume(){
        this.setState({ muted: !this.state.muted });
    }

    toggleRepeat(){
        this.setState({ repeat: !this.state.repeat });
    }

    toggleShuffle(){
        this.setState({ shuffle: !this.state.shuffle });
    }
    goBackward(){
        if(this.state.currentTime < 3 && this.state.songIndex !== 0 ){
        this.setState({
            songIndex: this.state.songIndex - 1,
            currentTime: 0,
        });
        } else {
        this.refs.audio.seek(0);
        this.setState({
            currentTime: 0,
        });
        }
    }

    goForward(){
        this.setState({
        songIndex: this.state.shuffle ? this.randomSongIndex() : this.state.songIndex + 1,
        currentTime: 0,
        });
        this.refs.audio.seek(0);
    }

    randomSongIndex(){
        let maxIndex = this.props.songs.length - 1;
        return Math.floor(Math.random() * (maxIndex - 0 + 1)) + 0;
    }

    setTime(params){
        if( !this.state.sliding ){
        this.setState({ currentTime: params.currentTime });
        }
    }
    onLoad(params){
        this.setState({ songDuration: params.duration });
    }
    onSlidingStart(){
        this.setState({ sliding: true });
    }
    onSlidingChange(value){
        let newPosition = value * this.state.songDuration;
        this.setState({ currentTime: newPosition });
    }
    onSlidingComplete(){
        this.refs.audio.seek( this.state.currentTime );
        this.setState({ sliding: false });
    }
    onEnd(){
        this.setState({ playing:false, currentTime:0 });
    }


    componentDidMount(){
    this.spin()
    }
    spin(){
        this.spinValue.setValue(0)
        Animated.timing(
            this.spinValue,
            {
                toValue:1,
                duration:35000,
                easing:Easing.linear
            }
        ).start(()=>this.spin())
    }

    generateKey = (numberOfCharacters) => {
        return require('random-string')({length: numberOfCharacters});        
    }

    index = (data, song) => {
        return data.findIndex((x) => x.title == song.title);
    }

    render() {
        const spin_continue=this.spinValue.interpolate({
            inputRange:[0,1],
            outputRange:['0deg','360deg']
        });
        const spin_stop=this.spinValue.interpolate({
            inputRange:[0,1],
            outputRange:['0deg','0deg']
        });
        
    let songPlaying = this.props.songs[this.state.songIndex];
        
    let songPercentage;
    if( this.state.songDuration !== undefined ){
        songPercentage = this.state.currentTime / this.state.songDuration;
    } else {
        songPercentage = 0;
    }
        let spin=!this.state.playing?spin_stop:spin_continue;

        //PLAY BUTTON
        let playButton;
        if( this.state.playing ){
        playButton = <Icon onPress={ ()=>{this.togglePlay()}} style={ styles.play } name="pause" size={25} color="#fff" />;
        } else {
        playButton = <Icon onPress={ ()=>{this.togglePlay()}} style={ styles.play } name="play" size={25} color="#fff" />;
        }

        //FORWARD BUTTON
        let forwardButton;
        if( !this.state.shuffle && this.state.songIndex + 1 === this.props.songs.length ){
        forwardButton = <Icon style={ styles.forward } name="step-forward" size={25} color="#333" />;
        } else {
        forwardButton = <Icon onPress={ this.goForward.bind(this) } style={ styles.forward } name="step-forward" size={25} color="#fff" />;
        }

        //SHUFFLE BUTTON
        let shuffleButton;
        if( this.state.shuffle ){
        shuffleButton = <Icon onPress={ this.toggleShuffle.bind(this) } style={ styles.shuffle } name="random" size={22} color="#FF0009" />;
        } else {
        shuffleButton = <Icon onPress={ this.toggleShuffle.bind(this) } style={ styles.shuffle } name="random" size={22} color="#fff" />;
        }

        //REPEAT BUTTON
        let repeatButton;
        if( this.state.repeat ){
        repeatButton = <Icon onPress={ this.toggleRepeat.bind(this) } style={ styles.repeat } name="repeat" size={22} color="#FF0009" />;
        } else {
        repeatButton = <Icon onPress={ this.toggleRepeat.bind(this) } style={ styles.repeat } name="repeat" size={22} color="#fff" />;
        }

        //BACKWARD BUTTON
        let backwardButton;
        if(!this.state.shuffle && this.state.songIndex===0){
            backwardButton = <Icon style = { styles.back } name='step-backward' size={25} color='#333'/>
        }
        else{
            backwardButton = <Icon onPress = {()=>this.goBackward()} style = { styles.back } name='step-backward' size={25} color='#fff'/>
        }
        
        //FAVORITE BUTTON
        let favoriteButton;
        if(this.index(FavoriteList, songPlaying) == -1)
            favoriteButton = <TouchableOpacity onPress={() => {
                const newKey = this.generateKey(20);
                const newSong = {
                    key: newKey,
                    name: this.props.artist.name,
                    title: songPlaying.title,
                    album: songPlaying.album,
                    albumImage: songPlaying.albumImage,
                    url: songPlaying.url

                };    
                FavoriteList.push(newSong);                                                                  
            }} style={{width:25, height:25,marginTop:22, marginRight: 70}} >
                <Image source={require('../icon/favorite-off.png')}/>
            </TouchableOpacity>
        else
            favoriteButton = <TouchableOpacity onPress={ () => {
                    FavoriteList.splice(this.index(FavoriteList, songPlaying),1);
            }} style={{width:25, height:25, marginTop: 22, marginRight: 70}}>
                <Image source={require('../icon/favorite-on.png')}/>
            </TouchableOpacity>
        

        //Display Spin Image
        let image = songPlaying.albumImage ? songPlaying.albumImage : this.props.artist.background;
        return (
        <View style={{flex:1}}>
        <StatusBar backgroundColor='transparent' />
        <ImageBackground style={{flex:1,paddingTop:20}} source={picBg}>
            <View style={styles.container}>
                <Video source={{uri: songPlaying.url }}
                    ref="audio"
                    volume={ this.state.muted ? 0 : 1.0}
                    muted={false}
                    paused={!this.state.playing}
                    onLoad={ this.onLoad.bind(this) }
                    onProgress={ this.setTime.bind(this) }
                    onEnd={ this.onEnd.bind(this) }
                    resizeMode="cover"
                    repeat={this.state.repeat}/>

                <View style={ styles.header }>
                    <Text style={ styles.headerText }>
                        { this.props.artist.name }
                    </Text>
                    <View style={ styles.headerClose }>
                    </View>
                </View>
                <Animated.Image
                        style={{
                            marginBottom: 22,
                            width: 250,
                            height: 250,
                            borderRadius:250/2,
                            transform: [{rotate: spin}] }}
                            source={{uri: image}}/>
                <Text style={ styles.songTitle }>
                    { songPlaying.title }
                </Text>
                <Text style={ styles.albumTitle }>
                    { songPlaying.album }
                </Text>
                <View style={{flex:1,flexDirection:'row',paddingLeft:5,paddingRight:5}}>
                    <Text style={ styles.time }>{formattedTime(this.state.currentTime)}</Text>
                    <View style={ styles.sliderContainer }>
                        <Slider
                            onSlidingStart={ this.onSlidingStart.bind(this) }
                            onSlidingComplete={ this.onSlidingComplete.bind(this) }
                            onValueChange={ this.onSlidingChange.bind(this) }
                            minimumTrackTintColor='#40FF00'
                            style={ styles.slider }
                            trackStyle={ styles.sliderTrack }
                            thumbStyle={ styles.sliderThumb }
                            value={ songPercentage }/>
                    </View>
                    <Text style={ styles.timeRight }>{formattedTime(this.state.songDuration)}</Text>
                </View>
                <View style={ styles.controls }>
                    { favoriteButton }
                    { repeatButton }
                    { backwardButton }
                    { playButton }
                    { forwardButton }
                    { shuffleButton }
                </View>
            </View>
        </ImageBackground>
        </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    header: {
        marginTop: 17,
        marginBottom: 17,
        width: window.width,
    },
    headerClose: {
        position: 'absolute',
        top: 2,
        left: 0,
        paddingTop: 0,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 20,
    },
    headerText: {
        color: "#FFF",
        fontSize: 18,
        textAlign: 'center',
    },
    songImage: {
        
        marginBottom: 22,
        width: 300,
        height: 300,
        borderRadius:300/2
    },
    songTitle: {
        color: "white",
        fontFamily: "Helvetica Neue",
        marginBottom: 10,
        marginTop: 13,
        fontSize: 19
    },
    albumTitle: {
        color: "#BBB",
        fontFamily: "Helvetica Neue",
        fontSize: 14,
        marginBottom: 20,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        paddingBottom:20
    },
    back: {
        marginTop: 22,
        marginLeft: 30,
    },
    play: {
        marginLeft: 30,
        marginRight:30,
        marginTop: 22,
    },
    forward: {
        marginTop: 22,
        marginRight: 30,
    },
    shuffle: {
        marginTop: 22,
    },
    repeat:{
        marginTop: 22,
    },
    volume: {
        marginTop: 26,
    },
    sliderContainer: {
        flex:7
    },
    timeInfo: {
        flexDirection: 'row',
    },
    time: {
        color: '#FFF',
        flex: 1,
        fontSize: 13,
    },
    timeRight: {
        color: '#FFF',
        textAlign: 'right',
        flex: 1,
        fontSize: 13,
    },
    slider: {
        height: 20,
    },
    sliderTrack: {
        height: 2,
        backgroundColor: '#A6A6AB',
    },
    sliderThumb: {
        width: 10,
        height: 10,
        backgroundColor: '#1E00FF',
        borderRadius: 10 / 2,
        shadowColor: 'red',
        shadowOffset: {width: 0, height: 0},
        shadowRadius: 2,
        shadowOpacity: 1,
    }
});

withLeadingZero = (amount) => {
    if (amount < 10 ){
        return `0${ amount }`;
    } else {
        return `${ amount }`;
    }
}
  
formattedTime = ( timeInSeconds ) => {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds - minutes * 60;
    
    if( isNaN(minutes) || isNaN(seconds) ){
        return "";
    } else {
        return(`${ withLeadingZero( minutes ) }:${ withLeadingZero( seconds.toFixed(0) ) }`);
    }
}