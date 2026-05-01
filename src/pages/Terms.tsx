import Wrapper from "../components/Wrapper";

const Terms = () => (
  <Wrapper>
    <div class="max-w-2xl w-full px-6 py-16">
      <h1 class="font-display text-3xl font-bold text-text-1 mb-8">Terms of Service</h1>
      <div class="text-text-2 text-sm leading-relaxed space-y-4">
        <p>
          By accessing the website at https://{import.meta.env.VITE_BASE}, you are
          agreeing to be bound by these terms of service, all applicable laws and
          regulations, and agree that you are responsible for compliance with any
          applicable local laws. If you do not agree with any of these terms, you
          are prohibited from using or accessing this site. The materials contained
          in this website are protected by applicable copyright and trademark law.
        </p>
        <p>
          In no event shall {import.meta.env.VITE_BASE} or its suppliers be liable
          for any damages (including, without limitation, damages for loss of data
          or profit, or due to business interruption) arising out of the use or
          inability to use the materials on {import.meta.env.VITE_BASE}'s website,
          even if {import.meta.env.VITE_BASE} or a {import.meta.env.VITE_BASE}{" "}
          authorized representative has been notified orally or in writing of the
          possibility of such damage. Because some jurisdictions do not allow
          limitations on implied warranties, or limitations of liability for
          consequential or incidental damages, these limitations may not apply to
          you.
        </p>
        <p>
          The materials appearing on {import.meta.env.VITE_BASE} website could
          include technical, typographical, or photographic errors.{" "}
          {import.meta.env.VITE_BASE} does not warrant that any of the materials on
          its website are accurate, complete or current. {import.meta.env.VITE_BASE}{" "}
          may make changes to the materials contained on its website at any time
          without notice. However {import.meta.env.VITE_BASE} does not make any
          commitment to update the materials.
        </p>
        <p>
          {import.meta.env.VITE_BASE} has not reviewed all of the sites linked to
          its website and is not responsible for the contents of any such linked
          site. The inclusion of any link does not imply endorsement by{" "}
          {import.meta.env.VITE_BASE} of the site. Use of any such linked website is
          at the user's own risk.
        </p>
        <p>
          {import.meta.env.VITE_BASE} may revise these terms of service for its
          website at any time without notice. By using this website you are agreeing
          to be bound by the then current version of these terms of service.
        </p>
      </div>
    </div>
  </Wrapper>
);

export default Terms;
