<template>
<div class="cp-box" id="comparison-box" :style="{height: height + 'px'}">
  <div class="cp-header">
    <div class="compare-header" id="compare-header">
      <div class="left" @click="hideSameItem">
        <p class="iconfont">&#xe669;</p>
        <p>隐藏相同</p>
      </div>
      <div class="main">
        <div class="slide">
          <div class="column" v-for="d in myData">
            <h4>{{d[props.name]}}</h4>
            <i class="reduce" @click="removeItem(d)">X</i>
          </div>
          <div class="column" @click="addItemHanlder"><i class="icon-add">+</i></div>
        </div>
      </div>
    </div>
    <div class="markbar">
      <group-header :title="groupTitle">
        <slot name="symbol"></slot>
      </group-header>
    </div>
  </div>

  <div class="compare-area">
    <div class="compare-detail">
      <div class="left">
        <div class="group" v-for="(group, index) in contrast">
          <h4 :style="{width: clientWidth + 'px'}" :id="'compare-detail-head-' + index">
            <group-header :title="group.name"></group-header>
          </h4>
          <div class="item" v-for="key in Object.keys(group.keys)">
            <span class="inner item-differ highlight">{{group.keys[key]}}</span>
          </div>
        </div>
      </div>

      <div class="main">
        <div class="slide">
          <div class="data" id="data">
            <div class="group" v-for="group in currentData">
              <div class="item" v-for="line in group">
                <span class="inner" v-for="grid in line">{{grid}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div class="dot-mask" v-show="showpanel" @click="showpanel = false"></div>
  <div class="col-dot">
    <span class="dot" @click="showpanel = !showpanel">目录</span>
    <div class="panle" v-show="showpanel">
      <a href="javascript:;" @click="scrollToParam(index)" v-for="(group, index) in contrast" class="btn">{{group.name}}</a>
    </div>
  </div>

</div>
</template>

<script>
import Scroller from '../libs/comparaScroller'
import GroupHeader from './GroupHeader'

export default {
  name: 'Comparison',
  props: {
    data: {
      type: Array,
      required: true
    },
    height: {
      type: Number,
      default () {
        return window.screen.height
      }
    },
    props: {
      type: Object,
      default () {
        return {
          name: 'name',
          key: 'key'
        }
      }
    },
    contrast: {
      type: Array,
      required: true
    }
  },

  components: {
    GroupHeader
  },

  watch: {
    data (value) {
      this.myData = this.data
      this.init()
    },
    contrast () {
      this.init()
    },
    groupTitleIndex (val) {
      this.groupTitle = this.contrast[val].name
    }
  },

  computed: {
  },

  data () {
    return {
      myData: [],
      clientWidth: document.body.clientWidth,
      headerHeight: 0,
      showpanel: false,
      groupTitle: null,
      groupTitleIndex: 0,
      scroller: null,
      currentData: [],
      headsTop: [],
      titleTopPostion: []
    }
  },

  mounted () {
    this.myData = this.data
    this.$nextTick(() => this.init())
  },

  methods: {
    init () {
      this.groupTitle = this.contrast[0].name
      this.currentData = []
      this.headerHeight = document.getElementById('compare-header').offsetHeight
      this.contrast.forEach(group => {
        let _g = []
        Object.keys(group.keys).forEach(key => {
          let _item = this.myData.map(d => (d[key] ? d[key] : '-'))
          _g.push(_item)
        })
        this.currentData.push(_g)
      })
      this.getHeadsTop()
      document.getElementById('comparison-box').addEventListener('scroll', this.setHeadName)
      this.titleTopPostion = this.contrast.map((par, index) => {
        return document.getElementById('compare-detail-head-' + index).getBoundingClientRect().top - this.headerHeight - 37
      })

      this.scroller = new Scroller('.slide')
      document.getElementById('data').style.width = (document.getElementsByClassName('column')[0].offsetWidth * this.myData.length) + 'px'
    },
    getHeadsTop () {
      this.contrast.forEach((p, index) => {
        this.headsTop.push(document.getElementById('compare-detail-head-' + index).getBoundingClientRect().top - this.headerHeight)
      })
    },
    scrollToParam (index) {
      this.groupTitleIndex = index
      document.getElementById('comparison-box').scrollTop = this.titleTopPostion[index] + this.headerHeight
    },
    setHeadName () {
      let _top = document.getElementById('comparison-box').scrollTop
      if (this.headsTop[this.groupTitleIndex + 1] && _top > this.headsTop[this.groupTitleIndex + 1]) {
        this.groupTitleIndex ++
      }
      if (_top < this.headsTop[this.groupTitleIndex] && this.groupTitleIndex >= 1) {
        this.groupTitleIndex --
      }
    },
    addItemHanlder () {
      this.$emit('add-item')
      this.init()
    },
    removeItem (item) {
      const index = this.myData.indexOf(item)
      if (index >= 0) {
        this.myData.splice(index, 1)
        this.init()
      }
    },
    hideSameItem () {
      // waiting
    }
  }
}
</script>

<style scoped lang="less">
.cp-box{
  position: relative;
  height: 100%;
  padding-top: 69px;
  overflow: scroll;
}
.cp-header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.compare-detail{
  display: table;
  width: 100%;
  background-color: #fff;
  .left {
    display: table-cell;
    width: 7rem;
    border-right: solid #d7d7d7 1px;
    .group{
      width: 7rem;
      h4{
        margin: 0;
        position: relative;
        z-index: 1;
        width: 100px;
        font-size: 0.75rem;
        height: 37px;
        line-height: 37px;
        overflow: hidden;
        color: #666;
        background-color: #f0f0f0;
        pointer-events: none;
        font-weight: normal;
        strong{
          margin-left: 0.5rem
        }
        .markup{
          position: fixed;
          top: 0;
          right: 0.5rem;
          font-size: 0.75rem;
          .tp-icon{
            float: right;
            margin-left: 10px;
          }
        }
      }
      .item{
        display: table;
        width: 100%;
        .inner{
          display: table-cell;
          height: 4rem;
          padding: 0 0.25rem;
          font-size: 0.75rem;
          color: #666;
          line-height: 1.3;
          text-align: center;
          vertical-align: middle;
          white-space: normal;
          border-top: solid #d7d7d7 1px;
          word-wrap: break-word;
          word-break: break-all;
        }
      }
    }
  }
  .main{
    position: relative;
    display: table-cell;
    overflow: hidden;
    .slide{
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      font-size: 0;
      white-space: nowrap;
      .data{
        position: relative;
        height: 100%;
        .group{
          width: auto;
          .item{
            width: 100%;
            table-layout: fixed;
            display: table;
            &:first-child{
              margin-top: 37px;
            }
            .inner{
              display: table-cell;
              height: 4rem;
              padding: 0 0.25rem;
              font-size: 0.75rem;
              line-height: 1.3;
              text-align: center;
              vertical-align: middle;
              white-space: normal;
              border-top: solid #d7d7d7 1px;
              width: 6.9375rem;
              color: #444;
              border-right: solid #d7d7d7 1px;
              word-wrap: break-word;
              word-break: break-all;
            }
          }
        }
      }
    }
  }
}

.compare-header{
  display: table;
  width: 100%;
  height: 5.75rem;
  background-color: #fff;
  .left{
    display: table-cell;
    width: 7rem;
    border-right: solid #d7d7d7 1px;
    vertical-align: middle;
    text-align: center;
    color: #999;
  }
  .main{
    position: relative;
    display: table-cell;
    overflow: hidden;
    .slide{
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      font-size: 0;
      white-space: nowrap;
      .column{
        position: relative;
        width: 7.4375rem;
        display: inline-block;
        height: 100%;
        vertical-align: top;
        border-right: solid #d7d7d7 1px;
        h4{
          margin: 0;
          height: 3em;
          margin-top: 1.125rem;
          padding: 0 0.25rem;
          font-size: 0.75rem;
          font-weight: bold;
          color: #444;
          line-height: 1.5;
          white-space: normal;
          overflow: hidden;
          display: box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          strong{
            margin-left: 0.5rem
          }
        }
        .icon-add{
          display: inline-block;
          width: 1.2em;
          height: 1.2em;
          background-color: #ccc;
          text-align: center;
          border-radius: 100%;
          line-height: 1.2em;
          text-align: center;
          font-weight: normal;
          font-size: 35px;
          color: #fff;
          margin: 0.4em 0 0 0.7em;
        }
        .price{
          padding: 0 0.25rem;
          font-size: 0.875rem;
          font-weight: bold;
          color: #f43531;
          line-height: 1.5;
        }
        .reduce{
          position: absolute;
          top: 0;
          right: 0;
          z-index: 10;
          font-style: normal;
          width: 1.125rem;
          height: 1.125rem;
          font-size: 1.125rem;
          line-height: 1.125rem;
          text-align: right;
          text-align: center;
          background-color: #ccc;
          color: #fff;
        }
      }
    }
  }
}

.markbar{
  position: relative;
  z-index: 1;
  height: 37px;
  line-height: 37px;
  font-size: 0.75rem;
  color: #666;
  background-color: #f0f0f0;
  &:before{
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 0;
    border-top: solid #d7d7d7 1px;
  }
  &:after{
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 0;
    border-bottom: solid #d7d7d7 1px;
  }
}


.param-compare-box{
  border-bottom: solid #e0e0e0 1px;
  .left-title{
    float: left;
    width: 100px;
    .base-head{
      text-align: center;
    }
    .head-area{
      position: relative;
      height: 35px;
    }
    .head{
      height: 35px;
      width: 100%;
      position: absolute;
      line-height: 35px;
      overflow: hidden;
      padding: 0 10px;
      .t{
        left: left
      }
      .tp-icon{
        float: right;
        margin-left: 10px;
      }
    }
  }
  .content{
    .column{
      width: 100px;
      text-align: center;
    }
    margin-left: 100px;
    .base{

    }
  }
}
.params-box{
  border-bottom: solid #e0e0e0 1px;
  .head{
    line-height: 35px;
    overflow: hidden;
    padding: 0 10px;
    .t{
      left: left
    }
    .tp-icon{
      float: right;
      margin-left: 10px;
    }
  }
  .bd{
    background-color: #fff;
    .line{
      border-bottom: solid 1px #f0f0f0;
      overflow: hidden;
      dt{
        border-right: solid 1px #f0f0f0;
        float: left;
        text-align: left;
        text-indent: 10px;
        line-height: 35px;
        width: 120px;
        color: #999999;
      }
      dd{
        text-align: center;
        line-height: 35px;
      }
    }
  }
}
.box{
  padding: 10px;
}
.dot-mask{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 101;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3)
}
.col-dot{
  position: fixed;
  left: 10px;
  z-index: 105;
  bottom: 10px;
  .dot{
    display: block;
    background-color: rgba(54, 169, 92, 0.7);
    color: #fff;
    border-radius: 100%;
    height: 50px;
    width: 50px;
    line-height: 50px;
    text-align: center;
    color: #fff;
    font-size: 16px;
  }
  .panle{
    background-color: #ffffff;
    width: 250px;
    padding: 10px;
    position: absolute;
    left: 70px;
    bottom: 0px;
    border-radius: 10px;
    &:before {
      position: absolute;
      width: 0;
      height: 0;
      left: -20px;
      bottom: 15px;
      border-top: 10px solid transparent;
      border-right: 20px solid #fff;
      border-bottom: 10px solid transparent;
      content: "";
    }
    .btn {
      float: left;
      margin-left: 10px;
      margin-bottom: 10px;
      border: solid 1px #c0c0c0;
      text-decoration: none;
      color: #333;
      width: 110px;
      text-align: center;
      line-height: 35px;
      border-radius: 10px;
      font-size: 14px;
    }
  }
}
</style>
