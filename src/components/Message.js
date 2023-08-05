import React from 'react';
import { HStack, Avatar, Text, AvatarBadge } from "@chakra-ui/react";



export default function Message({ text, url, user = "other" }) {
   return (

      <HStack alignSelf={user === 'me' ? 'flex-end' : 'flex-start'} bg={'gray.100'} paddingX={6} paddingY={'1'} borderRadius={"base"} >


         {
            user === "other" && <Avatar size={'sm'} src={url}>
               {/* <AvatarBadge boxSize='1.25em' bg='green.500' /> */}
            </Avatar>
         }
         <Text>
            {text}
         </Text>
         {
            user === "me" && <Avatar size={'sm'} src={url}>
            </Avatar>
         }

      </HStack>
   )
}
