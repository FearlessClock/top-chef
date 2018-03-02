class IndecisionApp extends React.Component {
      constructor(props) {
        super(props);
        this.restoNameCallback = this.restoNameCallback.bind(this);
        this.getDealsFromAPICallback = this.getDealsFromAPICallback.bind(this);
        this.state = {  
          RestaurentNames: [],
          Deals: []
        };
      }

      componentDidMount() {
        this.RestoNames();
        this.getDealsFromAPI();
      }

      RestoNames() {
        $.getJSON('http://127.0.0.1:1234/getNames?callback=?', this.restoNameCallback)
      }

      restoNameCallback(results){
        this.setState({ RestaurentNames: results })
      }

      getDealsFromAPI() {
        $.getJSON('http://127.0.0.1:1234/getDeals?callback=?', this.getDealsFromAPICallback)
      }

      getDealsFromAPICallback(results){
        this.setState({ Deals: results })
      }

      render() {
        const title = 'Top Chef';
        const subtitle = 'Get good deals on great restaurents';
    
        return (
          <div className="Screen">
            <Header title={title} subtitle={subtitle} />
            <Options
              data={this.state.Deals}
            />
          </div>
        );
      }
    }
    
    class Header extends React.Component {
      render() {
        return (
          <div className="navbar navbar-inverse">
            <h1>{this.props.title}</h1>
            <h2>{this.props.subtitle}</h2>
          </div>
        );
      }
    }
    
    class Options extends React.Component {
      render() {
        return (
          <div className="row">
            <div className="col-md-4">
              {
                this.props.data.map((info) => <Option 
                                              key={info._id} 
                                              info={info} />)
              }
            </div>
          </div>
        );
      }
    }
    
    class Option extends React.Component {
      render() {
        return (
          <div className="card">
            <div className="card-block">
              <p className="card-title">{this.props.info.name}</p>
              <p>{this.props.info.description}</p>
              {this.props.info.deals.map((deal) => <Deal deal={deal}/>)}
            </div>
          </div>
        );
      }
    }

    class Deal extends React.Component{
      render(){
        return (
          <div className="card">
            <div className="deal">
              <p>{this.props.deal}</p>
            </div>
          </div>
        );
      }
    }
    
    ReactDOM.render(<IndecisionApp />, document.getElementById('app'));
    