export default function ErrorPage() {
    return (
      <div className="container text-center mt-5">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>The page you are looking for does not exist.</p>
        <a href="/login">Return to the login page</a>
      </div>
    );
  }