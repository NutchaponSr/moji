interface Props {
  params: Promise<{ organizationId: string }>;
}

const Page = async ({ params }: Props) => {
  const { organizationId } = await params;

  return (
    <div>
      {organizationId}
    </div>
  );
}

export default Page;