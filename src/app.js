class IndecisionApp extends React.Component {
      constructor(props) {
        super(props);
        this.restoNameCallback = this.restoNameCallback.bind(this);
        this.state = {  
          RestaurentNames: [],
          Deals: []
        };
      }

      componentDidMount() {
        this.RestoNames();
      }

      RestoNames() {
        $.getJSON('http://127.0.0.1:1234/getNames?callback=?', this.restoNameCallback)
      }

      restoNameCallback(results){
        this.setState({ data: results })
      }

      render() {
        const title = 'Top Chef';
        const subtitle = 'Get good deals on great restaurents';
    
        return (
          <div>
            <Header title={title} subtitle={subtitle} />
            <Options
              data={this.state.data}
            />
          </div>
        );
      }
    }
    
    class Header extends React.Component {
      render() {
        return (
          <div>
            <h1>{this.props.title}</h1>
            <h2>{this.props.subtitle}</h2>
          </div>
        );
      }
    }
    
    class Options extends React.Component {
      render() {
        return (
          <div>
            {
              this.props.data.map((info) => <Option key={info._id} optionText={info.name} />)
            }
          </div>
        );
      }
    }
    
    class Option extends React.Component {
      render() {
        return (
          <div>
            {this.props.optionText}
          </div>
        );
      }
    }
    
    ReactDOM.render(<IndecisionApp />, document.getElementById('app'));
    