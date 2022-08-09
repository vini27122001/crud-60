import React, { Component } from 'react';


class Counter extends Component {
    

    renderTags() {
        
        this.newMethod();
        return <ul>{this.state.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
    }
    
    
    
    render() { 
        return (
            
            <div>    
            <span className={this.getBadgesClasses()}>{this.formatCount()}</span>
            <button onClick={()=>this.props.onIncrement(this.props.counter)} className='btn btn-secondary btn-sm'>
                Adicionar
            </button>
            <button onClick={() => this.props.onDelete(this.props.counter.id)} className='btn btn-danger btn-sm m-2'> Deletar</button>
            </div>

);
}

formatCount() {
    const { value }  = this.props.counter;
    return value === 0 ? 'Zero' : value
}

getBadgesClasses() {
    let classes = 'badge m-2 bg-';
    classes += this.props.counter.value === 0 ? 'warning' : 'primary';
    return classes;
}

handleIncrement = product => {
    console.log(product)
    this.setState({value : this.state.value + 1})
}


}

export default Counter;


