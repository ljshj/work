/**
* 自定义隐藏域
*/

var React = require('react-native');
var t = require('tcomb-form-native');
var {
    Platform,
    Dimensions,
    PixelRatio,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} = React;

class TcombHiddenField extends t.form.Component {

    /**
    * 构造函数，声明初始化 state
    */
    constructor(props) {
        super(props);
        this.state      = {
            value: props.value,
        };
    }

    /**
    * 取选项值
    */
    getValue() {
        return this.state.value;
    }

    /**
    * 选项发生改变时调用
    */
    onChange(optionValue) {
        this.setState({value: optionValue}, () => this.props.onChange(this.state.value, this.props.ctx.path));
    }

    /**
    * 模板
    */
    getTemplate() {
        return (locals) => {
            return (
                <View 
                    style={{
                    	height: 0,
                    }} 
                    ref='input'>
                </View>
            );
        };
    }
}

module.exports = TcombHiddenField;
