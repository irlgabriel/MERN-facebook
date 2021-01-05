import {
  Container,
  Like,
  Overlay,
  Image,
  Paragraph,
  Header
} from './LikesModal.components'

const LikesModal = ({setLikesModal, likes}) => {
  
  return (
    <Overlay onClick={() => setLikesModal(false)}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          <Paragraph>
            Liked by {likes.length} people
          </Paragraph>
        </Header>
        {likes.map(like =>
          <Like to={`/users/${like._id}`}>
            <Image width="24px" src={like.profile_photo} />
            <Paragraph>{like.display_name || like.first_name + ' ' + like.last_name}</Paragraph>
          </Like>
        )}
      </Container>
    </Overlay>
  )
}

export default LikesModal;