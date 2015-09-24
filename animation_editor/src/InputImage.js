define(['React'],function(React){
    return React.createClass({
        getInitialState:function(){
            return {
                image:null,
                value:"",
                images:[]
            }
        },
        allowedExtensions:[
            'image/png',
            'image/jpeg',
            'image/gif'
        ],
        URL:null,
        getDefaultProps:function(){
            return {
                title:'Adicionar Imagem',
                multiple:false,
                add:null
            }
        },
        render:function(){
            var self = this;
            var size = self.state.images.length;
            var info = size > 0?size == 1?'1 imagem selecionada':size +' imagens selecionadas':'Nenhuma imagem selecionada';

            return (
                <div className="input-image">
                    <label>{self.props.title}</label>
                    <div className="input-group">
                        <input type="file" className="form-control" style={{display:'none'}} ref="inputImage" onChange={self.change} multiple={self.props.multiple} />
                        <span>
                            <button type="button" onClick={self.click}>Selecione as Imagens</button>
                        </span>
                        <span className="input-image-info">
                            {info}
                        </span>
                        <span className="input-group-addon" onClick={self.add}>
                            Adicionar
                        </span>
                    </div>
                </div>
            );
        },
        add:function(){
            var self = this;
            if(typeof this.props.add == 'function'){
                self.props.add(self.state.images);
            }
            self.setState({
                images:[]
            });
        },
        click:function(){
            React.findDOMNode(this.refs.inputImage).click();
        },
        change:function(e){
            var self = this;
            var files = e.target.files;
            var imageFiles = [];
            var URL = self.getURL();
            for(var i = 0; i < files.length;i++){
                if(self.allowedExtensions.indexOf(files[i].type) != -1){
                    var url = URL.createObjectURL(files[i]);
                    imageFiles.push(url);
                }
            }
            self.setState({
                images:imageFiles
            });
        },
        getURL:function(){
            var self = this;
            if(self.URL == null){
                self.URL = window.URL || window.webkitURL;
            }
            return self.URL;
        }
    });
});