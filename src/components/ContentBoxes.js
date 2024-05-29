import { Box, Text, Icon } from '@chakra-ui/react';
import {
  FiDollarSign,
  FiZap,
  FiTrendingUp,
  FiPlusCircle,
} from 'react-icons/fi';

function ContentBoxes() {
  const contentData = [
    {
      icon: FiDollarSign,
      title: '50% Revenue Share',
      description:
        'Half of the collected revenue is distributed to users as a reward for their engagement and investment in the platform.',
    },
    {
      icon: FiZap,
      title: '25% Buyback and Burn',
      description:
        'A quarter of the revenue is allocated to buy back and burn tokens, aiming to decrease the supply.',
    },
    {
      icon: FiTrendingUp,
      title: '25% Treasury',
      description:
        "The remaining quarter is allocated to the platform's treasury for development, marketing, and operational expenses, supporting growth and innovation.",
    },
    {
      icon: FiPlusCircle,
      title: 'Plus',
      description:
        'While the token has a tax, 20% of it will be distributed among the holders, increasing their revenue share.',
    },
  ];

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      data-aos="fade-up"
      mt={10}
      mb={{ base: '3', md: '20' }}
    >
      {contentData.map((c, index) => (
        <Box
          key={index}
          width={{ base: '100%', md: '20%' }}
          boxSizing="border-box"
          justifyContent="center"
          border="1px solid #05a3ba"
          borderRadius="10px"
          m="0.5rem"
          p="1rem"
          bg=""
        >
          <Icon as={c.icon} w={6} h={6} color="#05a3ba" mb={2} />
          <Text
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="bold"
            color="#05a3ba"
            mb="0.5rem"
          >
            {c.title}
          </Text>
          <Text
            fontWeight="200"
            fontSize={{ base: '1rem', md: '1.2rem' }}
            color="white"
          >
            {c.description}
          </Text>
        </Box>
      ))}

      <Text mt={10} fontSize={{ base: 'sm', md: 'sm' }}>
        <span style={{ color: '#05a3ba' }}>* </span>To be eligible for the
        revenue share, you need to hold 0.1% of the supply...{' '}
        <a
          href="https://docs.2fai.xyz/revenue-share"
          target="_blank"
          className="learn"
          rel="noreferrer"
        >
          Learn more
        </a>
      </Text>
    </Box>
  );
}

export default ContentBoxes;
