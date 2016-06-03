'use strict';

var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.scss');

//获取图片相关数据
var imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageURL(imageDatasArr){
	for (var i = 0, j = imageDatasArr.length; i < j; i++){
		var singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('../images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
	}

	return imageDatasArr;
})(imageDatas);



//单个图片组件
var ImgFigure = React.createClass({
  render: function(){
    return (
        <figure className="img-figure" >
          <img src={this.props.data.imageURL} alt={this.props.data.title}/>
          <figcaption>
            <h2 className="img-title">{this.props.data.title}</h2>
          </figcaption>
        </figure>
      );
  }
});



//app入口
var GalleryByReactApp = React.createClass({
  //给图片排布范围定义常量
  Constant: {
    centerPos: {//中心点位置
      left: 0,
      right: 0
    },
    hPosRange:{//水平方向的取值范围
      leftSecX: [0,0],
      rightSecX: [0,0],
      y: [0,0]
    }
    vPosRange: {//垂直方向的取值范围
      x: [0,0],
      topY: [0,0]
    }
  },

  //组件加载后，为每张图片计算其位置的范围
  componentDidMount: function(){
    //首先拿到舞台大小
    var stageDOM = React.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    //拿到一个imgFigure的大小
    var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    //计算左侧、右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfImgW + halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[0] = halfStageW;
  },



  //渲染页面
  render: function() {
    var controllerUnits = [],
        imgFigures = [];

    //调用图片组件，并为其添加索引，以便为每一张图片计算位置
    imageDatas.forEach(function(value, index){
      imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index}/>);
    });

    //渲染整个舞台
    return (
      <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigures}
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
      </section>
      
    );
  }

});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
