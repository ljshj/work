'use strict';

import { Component } from 'react';
import ReactDOM from 'react-dom';
import NavCard from '../../../components/NavCard.jsx';
import StatsList from './list.jsx';

class StatsMain extends Component {
	
	constructor (props) {
		super(props);
		this.state={
			listVersion:1,
			items:[]
		};
		console.info("进入IndexMain！！！！！！！！！！！ ");
		this.state.items.push(this.getHomeCmp());
	}
	getHomeCmp(){

		let statsList  = (<StatsList key = 'statistic' name = '数据统计' version = {this.state.listVersion} />)

		return statsList;
	}

	back(){
		this.state.items.pop();
		this.state.listVersion = this.state.listVersion+1;
		this.setState({items:this.state.items});
	}

	refreshList(){
		this.state.items=[];
		this.state.items.listVersion++;
		this.state.items[0] = this.getHomeCmp();
		this.setState({items:this.state.items,listVersion:this.state.listVersion});
	}

	selectCard(card){ 
		var items=[],i=0;
		for( i=0;i<this.state.items.length;i++ ){
			items.push(this.state.items[i]);
			if( this.state.items[i].key == card.key )break;
		}
		this.state.items = items;
		this.setState( this.state.items );
	}

	render () {
		return (
				<NavCard onBack={this.back.bind(this)} onSelect={this.selectCard.bind(this)} >
					{this.state.items}
				</NavCard>
		) 
	}
}

module.exports = StatsMain;
