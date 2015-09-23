define(['React'],function(React){
    return React.createClass({
        getInitialState:function(){
            return {
                image:null,
                value:""
            }
        },
        getDefaultProps:function(){
            return {
                title:'Adicionar Imagem',
                multiple:false
            }
        },
        render:function(){
            var self = this;
            return (
                <div className="inputContainer">
                    <label>{self.props.title}</label>
                    <div className="input-group">
                        <input type="file" className="form-control" ref="inputImage" onChange={self.change} multiple={self.props.multiple}/>
                        <span className="input-group-addon">
                            Adicionar
                        </span>
                    </div>
                </div>
            );
        },
        change:function(e){
            console.log(e.target.files);
        }
    });
});