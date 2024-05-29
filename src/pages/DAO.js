import React from 'react';
import {
  useQuery,
  gql,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import {
  Text,
  Flex,
  Box,
  Button,
  Card,
  Link,
  Heading,
  useMediaQuery,
} from '@chakra-ui/react';
import Header2 from '../components/Header2';
import Footer2 from '../components/Footer2';
import bgImage from '../img/2fai-patt.svg';
import MobileFooterMenu from '../components/MobileFooterMenu.tsx';

const GET_PROPOSALS = gql`
  query GetProposals($spaceId: String!) {
    proposals(
      first: 20
      skip: 0
      where: { space_in: [$spaceId] }
      orderBy: "created"
      orderDirection: desc
    ) {
      id
      title
      body
      start
      end
      snapshot
      state
      author
      space {
        id
        name
      }
    }
  }
`;

const client = new ApolloClient({
  uri: 'https://hub.snapshot.org/graphql',
  cache: new InMemoryCache(),
});

const DAO = () => {
  const [isMobile] = useMediaQuery('(max-width: 1000px)');
  const { loading, error, data } = useQuery(GET_PROPOSALS, {
    variables: { spaceId: '2fai.eth' },
  });

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const proposals = data?.proposals || [];

  const getStateColor = state => {
    switch (state) {
      case 'active':
        return 'green.500';
      case 'pending':
        return 'blue.500';
      default:
        return 'red.500';
    }
  };

  return (
    <>
      <div className="noise"></div>
      <Header2 />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        mt={{ base: 0, md: 0 }}
        backgroundPosition="center"
        backgroundSize="cover"
        sx={{
          bg: '#05041a',
          minH: '95vh',
          '@media screen and (min-width: 768px)': {
            backgroundImage: `url(${bgImage})`,
          },
        }}
        bg="#05041a"
        minH="100vh"
        px={{ base: 3, md: 12 }}
        py={10}
      >
        <Heading
          fontSize={{ base: '3xl', md: '6xl' }}
          fontWeight="bold"
          color="#ffffff"
          marginTop={'1rem'}
          marginBottom={'2rem'}
        >
          <span className="linear-wipe2">DAO Proposals</span>
        </Heading>
        <Text
          fontWeight={'bold'}
          fontSize={{ base: '1xl', md: '2xl' }}
          color="#ffffff"
          textAlign="center"
          marginBottom={'3rem'}
        >
          Your $2FAI tokens are the key to influencing pivotal DAO resolutions
        </Text>

        {proposals.length > 0 ? (
          <Flex direction="column" gap={6} mt={5}>
            {proposals.map(proposal => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                getStateColor={getStateColor}
              />
            ))}
          </Flex>
        ) : (
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="#ffffff"
            textAlign="center"
            background="#05a3ba"
            borderRadius="5px"
            width="fit-content"
            margin="0 auto"
            padding="5px 10px 5px 10px"
          >
            Currently, there are no active proposals
          </Text>
        )}

        {isMobile && <MobileFooterMenu />}
      </Box>
    </>
  );
};

const ProposalCard = ({ proposal, getStateColor }) => (
  <Flex justifyContent="center" alignItems="center">
    <Card
      p={4}
      maxWidth="1100px"
      border={'2px solid #05a3ba'}
      bg="#05a3ba1c!important"
    >
      <Box
        p={2}
        bg={getStateColor(proposal.state)}
        color="white"
        fontWeight="bold"
        textAlign="center"
        float={'right'}
        width="120px"
        fontSize={'14px'}
        mb={{ base: 0, md: -9 }}
        ml={-4}
      >
        {proposal.state.charAt(0).toUpperCase() + proposal.state.slice(1)}
      </Box>
      <Link
        href={`https://snapshot.org/#/${proposal.space.id}/proposal/${proposal.id}`}
        isExternal
        textDecoration="none"
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={5}
          mt={{ base: 0, md: -15 }}
          as="u"
        >
          {proposal.title}
        </Text>
      </Link>
      <Text fontSize="lg" noOfLines={4} mb={4} mt={5} pl={5} pr={5}>
        {proposal.body}
      </Text>
      <Flex justifyContent="center">
        <Button
          mt={5}
          mb={5}
          width="250px"
          background={
            proposal.state === 'closed'
              ? 'orange.500!important'
              : '#05a3ba!important'
          }
          _hover={{
            background: proposal.state === 'closed' ? 'orange.600' : '#048a9d',
          }}
          onClick={() =>
            window.open(
              `https://snapshot.org/#/${proposal.space.id}/proposal/${proposal.id}`,
              '_blank'
            )
          }
        >
          {proposal.state === 'closed' ? 'View Results' : 'Vote Now'}
        </Button>
      </Flex>
    </Card>
  </Flex>
);

const DAOWithApollo = () => (
  <ApolloProvider client={client}>
    <DAO />
  </ApolloProvider>
);

export default DAOWithApollo;
