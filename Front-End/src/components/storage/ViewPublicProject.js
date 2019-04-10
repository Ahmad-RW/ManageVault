import React, { Component } from 'react'
import Navbar from '../layout/Navbar';
var assets = require.context("../../assets", true)
class ViewPublicProject extends Component {
    constructor(props) {
        super(props)
        console.log(props.location.state.project)
    }
    renderLogo = (contentType) => {
        let imgSrc;
        try {
            let type = contentType.substring(contentType.indexOf("/") + 1);
            console.log(type)
            imgSrc = assets("./" + type + ".svg")
        } catch (error) {
            imgSrc = assets("./file.svg")
        }
        return (
            <img src={imgSrc} />
        )

    }
    renderDocumentsCard = () => {
        return (
            this.props.location.state.project.documents.map(doc => {

                if (doc.file !== "") {
                    return (
                        <div class="card border-secondary mb-3 col-sm-3" key={doc._id} >
                            <div class="card-header bg-transparent border-primary"><span className="storage-card">{doc.name}</span></div>
                            <div class="card-body ">
                                <h5 class="card-title">
                                    {this.renderLogo(doc.contentType)}
                                </h5>
                                <p class="card-text">
                                    <a className="text-dark" href={doc.file} target="_blank"><i class="material-icons">cloud_download</i></a>
                                </p>
                            </div>
                            <div class="card-footer bg-transparent border-primary">Footer</div>
                        </div>
                    )
                }
            })
        )
    }
    render() {
        return (
            <div>
            <Navbar />
            <div className="container">
                <div className="row">
                    {this.renderDocumentsCard()}
                </div>
            </div>
            </div>
        )
    }
}

export default ViewPublicProject