

import React from 'react';
import FloatingNav from '../components/Navbar/Navbar';
import { navItems, notes } from '../constants'; 
import { Button, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text } from '@chakra-ui/react';

const PreviousPaperPage = () => {
  

  const styles = {
    container: {
      display: 'flex',
      height: '130vh',
      fontFamily: 'Arial, sans-serif',
    },
    mainContent: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: '20px',
      overflowY: 'auto', 
    },
    cardContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent:"flex-start",
      marginTop:"50px",
      maxWidth: '1200px', 
      margin: '0 auto'
    },
  };

  return (
    <div style={styles.container}>
      <FloatingNav navItems={navItems} />
      <div style={styles.mainContent}>
      <Heading as="h1" size="2xl"  color="black" mb={10} mr={900} fontWeight="bold">PreviousPaper</Heading> 
        <div style={styles.cardContainer}>
          {notes.map((note) => (
            <Card  maxW="sm" p={4}>
              <CardHeader>
                <Heading size='md' >{note.title}</Heading>
              </CardHeader>
              <CardBody>
                <Text>{note.year}</Text>
                <Text>{note.regulation}</Text>
              </CardBody>
              <CardFooter>
                <Button>Download</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
};

export default PreviousPaperPage;