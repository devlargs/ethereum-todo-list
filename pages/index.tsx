import { Box, Button, Divider } from '@chakra-ui/react';
import useWeb3 from 'hooks/useWeb3';
import React, { FC } from 'react';

const Index: FC = () => {
  const { provider } = useWeb3();
  return (
    <Box p="10">
      <Button my="10" colorScheme="facebook">
        Connect
      </Button>
      <Divider />
    </Box>
  );
};

export default Index;
