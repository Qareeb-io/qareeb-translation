import axios from 'axios';
import { useEffect } from 'react';

const App: React.FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/');
        console.log(response.data);
      } catch (err) {
        console.error('error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  return <div className="App">test</div>;
};

export default App;