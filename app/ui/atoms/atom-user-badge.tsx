"use client"
import { User } from "@heroui/react";

export default function UserBadge({name, image, email}: {
    name: string,
    image: string,
    email: string,
}) {
    return (
        <User
          avatarProps={{
            src: image,
          }}
          description={
              <p>{email}</p>
          }
          name={name}
        />
      );
}