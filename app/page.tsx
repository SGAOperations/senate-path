export default function Home() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>SGA Senator Application, Nomination, and Audit System</h1>
      <p>
        The purpose of this application is to streamline the application and nomination 
        processes for senators at SGA (Student Government Association).
      </p>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Navigation</h2>
        <ul>
          <li><a href="/applications">Submit Application</a></li>
          <li><a href="/nominations">Nominate a Senator</a></li>
          <li><a href="/dashboard">View Dashboard</a></li>
          <li><a href="/admin">Admin Panel</a></li>
        </ul>
      </div>
    </main>
  );
}
