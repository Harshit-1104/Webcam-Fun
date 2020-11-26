import React, { Component } from 'react';
import { baseUrl } from './../shared/baseUrl';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

class Gallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isGalleryVisible: false,
      imagesContainer: null,
      isGalleryModalOpen: false,
      links: null,
      imagesFetched: false
    }

    this.toggleGallery = this.toggleGallery.bind(this);
    this.galleryModal = this.galleryModal.bind(this);
    this.toggleGalleryModal = this.toggleGalleryModal.bind(this);
    this.RenderPhotos = this.RenderPhotos.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentDidMount() {
    this.setState({
      imagesContainer: document.querySelector('.imagesContainer')
    }, () => {
      if (!this.state.imagesFetched) {
        fetch(baseUrl + 'album', {
          method: 'GET',
          headers: {
            'Authorization': `bearer ${this.props.user.token}`
          },
          credentials: 'same-origin',
          mode: 'cors'
        })
        .then((res) => res.json())
        .then((album) => {
          console.log(album);

          const links = album.photos.map((photo) => {
            return(photo.link);
          })

          this.setState({
            imagesFetched: true,
            links: links
          })
        })
        .catch((err) => console.log(err))
      }
    })
  }

  componentDidUpdate() {
    if (this.props.addToModal) {

      console.log('added');

      let tmp = this.state.links;
      tmp.push(this.props.link);

      this.setState({
        links: tmp
      })

      this.props.restoreDefault();
    }
  }

  toggleGallery() {
    this.setState({
      isGalleryVisible: !this.state.isGalleryVisible
    }, () => {
      let imagesContainer = this.state.imagesContainer;

      if (this.state.isGalleryVisible) 
        imagesContainer.style.display = 'none'
      else 
        imagesContainer.style.display = 'flex'

      this.setState({
        imagesContainer: imagesContainer
      })
    })
  }

  toggleGalleryModal() {
    this.setState({
      isGalleryModalOpen: !this.state.isGalleryModalOpen
    })
  }

  RenderPhotos() {
    const photos = this.state.links.map((link) => {
      return(
        <a href={link} download={this.props.user.username}>
          <img src={link} className="image">
          </img>
        </a>
      );
    })

    return photos;
  }

  galleryModal() {
    return (
      <Modal isOpen={this.state.isGalleryModalOpen} toggle={this.toggleGalleryModal} className="gallery-modal">
        <ModalHeader toggle={this.toggleGalleryModal}>Photos</ModalHeader>
        <ModalBody className="body">
          <this.RenderPhotos />
        </ModalBody>
      </Modal>
    )
  }

  render() {
    return(
      <div className="gallery row">
        <img src={require("../../public/assets/svgs/gallery2.svg")} id="galleryToggler" onClick={this.toggleGallery}/>
        <div className="imagesContainer">
          <div className="images">
            <div id="collector"></div>
          </div>
          <div id="counter" onClick={this.toggleGalleryModal}>
          </div>
          <this.galleryModal />
        </div>
      </div>
    )
  }
}

export default Gallery