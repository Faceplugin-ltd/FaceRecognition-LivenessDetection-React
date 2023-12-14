import React, { Component } from 'react';
import * as FaceSDK from "faceplugin"

export class FaceModules extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  async componentDidMount() {
    console.log("11111111111");
    await FaceSDK.load_opencv();
    await FaceSDK.loadDetectionModel();
    await FaceSDK.loadEyeModel();
    console.log("2222222222222");
  }

  render() {
    return(
      <p></p>
    )
  }

}
