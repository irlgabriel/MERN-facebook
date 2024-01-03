import React from "react";
import { Like, Image, Paragraph } from "./LikesModal.components";
import { Dialog } from "@headlessui/react";

const LikesModal = ({ setLikesModal, likes }) => {
  return (
    <Dialog
      className="relative z-50"
      open={true}
      onClose={() => setLikesModal(false)}
    >
      {/** BACKDROP */}
      <div className="flex flex-col justify-center fixed inset-0 blur-m bg-indigo-300/35" />

      <div className="bg-white h-3/5 w-fit border rounded-md border-solid border-neutral-600 min-w-96 m-auto fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="h-100 flex flex-col">
          <Dialog.Title className="text-xl mb-6">
            Liked by {likes.length} people
          </Dialog.Title>
          <Dialog.Panel className="overflow-auto">
            {likes.map((like) => (
              <Like href={`/users/${like._id}`}>
                <Image width="24px" height="24px" src={like.profile_photo} />
                <Paragraph>
                  {like.display_name || like.first_name + " " + like.last_name}
                </Paragraph>
              </Like>
            ))}
          </Dialog.Panel>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default LikesModal;
